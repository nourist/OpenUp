import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { User } from '../../entities/user.entity';
import { ChatType } from 'src/entities/chat.entity';

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
}
