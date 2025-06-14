import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { ChatParticipant } from 'src/entities/chatParticipants.entity';

@Injectable()
export class ChatService {
	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
		@InjectRepository(ChatParticipant)
		private readonly chatParticipantRepository: Repository<ChatParticipant>,
	) {}

	async createDirectChat(user1: User, user2: User) {
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
