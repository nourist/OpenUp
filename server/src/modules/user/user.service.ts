import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { User } from '../../entities/user.entity';
import { ChatType } from 'src/entities/chat.entity';
import { RedisService } from '../redis/redis.service';

export type UserRelation =
	| 'friendList'
	| 'blockedList'
	| 'blockedBy'
	| 'notifications'
	| 'notifications.invitation'
	| 'notifications.invitation.from'
	| 'notifications.message'
	| 'notifications.message.chat'
	| 'invitations'
	| 'invitations.to'
	| 'chats'
	| 'chats.chat'
	| 'chats.chat.participants'
	| 'chats.chat.lastMessage';

const getUserRelations = (relations: boolean | UserRelation[]): UserRelation[] => {
	if (typeof relations === 'boolean') {
		return relations
			? [
					'friendList',
					'blockedList',
					'blockedBy',
					'notifications',
					'notifications.invitation',
					'notifications.invitation.from',
					'notifications.message',
					'notifications.message.chat',
					'invitations',
					'invitations.to',
					'chats',
					'chats.chat',
					'chats.chat.participants',
					'chats.chat.lastMessage',
				]
			: [];
	}
	return relations;
};

@Injectable()
export class UserService {
	private readonly logger: Logger = new Logger(UserService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly redisService: RedisService,
	) {}

	async checkEmailExists(email: string) {
		const user = await this.userRepository.findOne({ where: { email } });
		return !!user;
	}

	async findByEmail(email: string, relations: boolean | UserRelation[] = false) {
		//false: no relations, true: all relations, array: specific relations
		const user = await this.userRepository.findOne({
			where: { email },
			relations: getUserRelations(relations),
		});
		if (!user) {
			this.logger.log(`User not found for email ${email}`);
			throw new BadRequestException('User not found');
		}
		return user;
	}

	async findById(id: number, relations: boolean | UserRelation[] = false) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: getUserRelations(relations),
		});

		//immediately throw error if user not found
		if (!user) {
			this.logger.log(`User not found for id ${id}`);
			throw new BadRequestException('User not found');
		}

		return user;
	}

	async getRelatedUsers(userId: number) {
		const user = await this.findById(userId, true).catch(() => null);
		if (!user) return [];
		const friendList = user.friendList.map((friend) => friend.id);
		const blockedList = user.blockedList.map((blocked) => blocked.id);
		const blockedBy = user.blockedBy.map((blockedBy) => blockedBy.id);
		const chats = user.chats
			.filter((chat) => chat.chat.type === ChatType.GROUP)
			.flatMap((chat) => chat.chat.participants.map((participant) => participant.id))
			.filter((id) => id !== userId);
		const relatedIds = new Set([...friendList, ...blockedList, ...blockedBy, ...chats]);
		const relatedUsers = await this.userRepository.find({
			where: {
				id: In(Array.from(relatedIds)),
			},
		});
		return relatedUsers;
	}

	async searchUserByEmail({q,limit}: { q: string; limit: number }) {
		const users = await this.userRepository.find({
			where: {
				email: ILike(`%${q}%`),
			},
			take: limit,
			relations: ['friendList', 'blockedList', 'blockedBy', 'chats', 'chats.chat'],
		});
		return users;
	}

	async getUserStatus(userId: number) {
		const redis = this.redisService.getClient();
		return Boolean(await redis.get(`socket:${await redis.get(`user:${userId}:socket`)}:online`));
	}

	async getRecommendUser(userId: number, {limit}:{limit:number}) {
		const user = await this.findById(userId, [
			'friendList',
			'blockedList',
			'blockedBy',
			'chats',
			'chats.chat',
			'chats.chat.participants',
		]);

		const friendIds = new Set(user.friendList.map((f) => f.id));
		const blockedIds = new Set(user.blockedList.map((b) => b.id));
		const blockedByIds = new Set(user.blockedBy.map((b) => b.id));

		const scores = new Map<number, number>();

		// Friend of friend logic
		if (friendIds.size > 0) {
			const friendsOfUser = await this.userRepository.find({
				where: { id: In(Array.from(friendIds)) },
				relations: ['friendList'],
			});

			for (const friend of friendsOfUser) {
				for (const fof of friend.friendList) {
					if (fof.id !== userId && !friendIds.has(fof.id)) {
						scores.set(fof.id, (scores.get(fof.id) || 0) + 2);
					}
				}
			}
		}

		// Same group logic
		const groupChats = user.chats.filter((c) => c.chat.type === ChatType.GROUP);
		for (const userChat of groupChats) {
			for (const participant of userChat.chat.participants) {
				if (participant.id !== userId && !friendIds.has(participant.id)) {
					scores.set(participant.id, (scores.get(participant.id) || 0) + 1);
				}
			}
		}

		// Filter out blocked users
		blockedIds.forEach((id) => scores.delete(id));
		blockedByIds.forEach((id) => scores.delete(id));

		// Filter out users who are already friends
		friendIds.forEach((id) => scores.delete(id));

		const sortedRecommendedIds = Array.from(scores.entries())
			.sort((a, b) => b[1] - a[1])
			.slice(0, limit)
			.map(([id]) => id);

		if (sortedRecommendedIds.length === 0) {
			return [];
		}

		const recommendedUsers = await this.userRepository.find({
			where: { id: In(sortedRecommendedIds) },
		});

		// Order the results based on score
		const userMap = new Map(recommendedUsers.map((u) => [u.id, u]));
		return sortedRecommendedIds.map((id) => userMap.get(id)).filter(Boolean);
	}
}
