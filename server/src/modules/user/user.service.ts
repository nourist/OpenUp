import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../entities/user.entity';

const userRelations = ['friendList', 'blockedList', 'blockedBy', 'notifications', 'notifications.invitation', 'notifications.invitation.from', 'invitations', 'invitations.to'];

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	findByEmail(email: string) {
		return this.userRepository.findOne({
			where: { email },
			relations: userRelations,
		});
	}

	async findById(id: number) {
		return this.userRepository.findOne({
			where: { id },
			relations: userRelations,
		});
	}
}
