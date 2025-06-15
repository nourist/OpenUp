import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user.entity';

type UserRelation =
	| 'friendList'
	| 'blockedList'
	| 'blockedBy'
	| 'notifications'
	| 'notifications.invitation'
	| 'notifications.invitation.from'
	| 'invitations'
	| 'invitations.to'
	| 'chats'
	| 'chats.chat'
	| 'chats.chat.participants'
	| 'chats.chat.lastMessage';
const userRelations: UserRelation[] = [
	'friendList',
	'blockedList',
	'blockedBy',
	'notifications',
	'notifications.invitation',
	'notifications.invitation.from',
	'invitations',
	'invitations.to',
	'chats',
	'chats.chat',
	'chats.chat.participants',
	'chats.chat.lastMessage',
];

const getUserRelations = (relations: boolean | UserRelation[]): UserRelation[] => {
	if (typeof relations === 'boolean') {
		return relations ? userRelations : [];
	}
	return relations;
};

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async findByEmail(email: string, relations: boolean | UserRelation[] = false) {
		//false: no relations, true: all relations, array: specific relations
		const user = await this.userRepository.findOne({
			where: { email },
			relations: getUserRelations(relations),
		});
		if (!user) {
			throw new BadRequestException('User not found');
		}
		return user;
	}

	async findById(id: number, relations: boolean | UserRelation[] = false) {
		const user = await this.userRepository.findOne({
			where: { id },
			relations: getUserRelations(relations),
		});
		if (!user) {
			throw new BadRequestException('User not found');
		}
		return user;
	}
}
