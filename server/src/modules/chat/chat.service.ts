import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { ChatParticipant } from 'src/entities/chatParticipants.entity';
import { UserService } from '../user/user.service';

export type ChatRelation = 'participants' | 'participants.user' | 'lastMessage';

const getChatRelations = (relations: boolean | ChatRelation[]): ChatRelation[] => {
	if (relations === true) return ['participants', 'participants.user', 'lastMessage'];
	if (Array.isArray(relations)) return relations;
	return [];
};

@Injectable()
export class ChatService {
	private readonly logger: Logger = new Logger(ChatService.name);

	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
		@InjectRepository(ChatParticipant)
		private readonly chatParticipantRepository: Repository<ChatParticipant>,
		private readonly userService: UserService,
	) {}

	async findById(id: number, type: ChatType, relations: boolean | ChatRelation[] = false) {
		const chat = await this.chatRepository.findOne({
			where: { id, type },
			relations: getChatRelations(relations),
		});

		if (!chat) {
			this.logger.log(`Chat not found for id ${id} and type ${type}`);
			throw new BadRequestException('Chat not found');
		}

		return chat;
	}

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

		this.logger.log(`Direct chat found: ${chat?.id}`);

		return chat;
	}

	async createDirectChat(user1: User, user2: User) {
		const existingChat = await this.findDirectChat(user1, user2);
		if (existingChat) {
			this.logger.log(`Direct chat already exists returning: ${existingChat.id}`);
			return existingChat;
		}

		const participant1 = this.chatParticipantRepository.create({
			user: user1,
		});

		this.logger.log(`Participant 1 created: ${participant1.id}`);

		await this.chatParticipantRepository.save(participant1);

		const participant2 = this.chatParticipantRepository.create({
			user: user2,
		});

		this.logger.log(`Participant 2 created: ${participant2.id}`);

		await this.chatParticipantRepository.save(participant2);

		const chat = this.chatRepository.create({
			type: ChatType.DIRECT,
			participants: [participant1, participant2],
		});

		this.logger.log(`Chat created for user ${user1.id} and user ${user2.id}: ${chat.id}`);

		return this.chatRepository.save(chat);
	}
}
