import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { ChatParticipant } from 'src/entities/chatParticipants.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
		@InjectRepository(ChatParticipant)
		private readonly chatParticipantRepository: Repository<ChatParticipant>,
		private readonly userService: UserService,
	) {}

	async findDirectChat(user1: User, user2: User) {
		const chat = await this.chatRepository
			.createQueryBuilder('chat')
			.leftJoin('chat.participants', 'participant')
			.leftJoin('participant.user', 'user')
			.where('chat.type = :type', { type: ChatType.DIRECT })
			.andWhere('user.id IN (:...userIds)', {
				userIds: [user1.id, user2.id],
			})
			.groupBy('chat.id')
			.having('COUNT(DISTINCT user.id) = 2')
			.getOne();

		return chat;
	}

	async createDirectChat(user1: User, user2: User) {
		const existingChat = await this.findDirectChat(user1, user2);
		if (existingChat) {
			return existingChat;
		}

		const participant1 = this.chatParticipantRepository.create({
			user: user1,
		});

		await this.chatParticipantRepository.save(participant1);

		const participant2 = this.chatParticipantRepository.create({
			user: user2,
		});

		await this.chatParticipantRepository.save(participant2);

		const chat = this.chatRepository.create({
			type: ChatType.DIRECT,
			participants: [participant1, participant2],
		});

		return this.chatRepository.save(chat);
	}
}
