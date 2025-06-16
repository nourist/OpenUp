import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user.entity';

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
}
