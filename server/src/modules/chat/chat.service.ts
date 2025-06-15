import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { ChatParticipant } from 'src/entities/chat-participants.entity';
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

	async findParticipant(chatId: number, userId: number, type?: ChatType) {
		const chat = await this.findById(chatId, true, type);
		await this.userService.findById(userId);
		const participant = chat.participants.find((participant) => participant.user.id === userId);

		if (!participant) {
			throw new BadRequestException('Participant not found in this chat');
		}

		return participant;
	}

	async findById(id: number, relations: boolean | ChatRelation[] = false, type?: ChatType) {
		const chat = await this.chatRepository.findOne({
			where: { id, ...(type ? { type } : {}) },
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

	async changeParticipantSettings(userId: number, { muted, pinned, chatId }: { muted?: boolean; pinned?: boolean; chatId: number }) {
		await this.findById(chatId, true);

		const participant = await this.findParticipant(chatId, userId);

		participant.settings.muted = muted ?? participant.settings.muted;
		participant.settings.pinned = pinned ?? participant.settings.pinned;

		this.logger.log(`User ${userId} ${muted ? 'muted' : 'unmuted'} and ${pinned ? 'pinned' : 'unpinned'} in group ${chatId}`);

		return this.chatParticipantRepository.save(participant);
	}

	async changeNickname({ chatId, userId, nickname }: { chatId: number; userId: number; nickname: string }) {
		await this.findById(chatId, true);
		await this.userService.findById(userId);

		const participant = await this.findParticipant(chatId, userId);

		participant.nickname = nickname;

		this.logger.log(`User ${userId} changed nickname to ${nickname} in group ${chatId}`);

		return this.chatParticipantRepository.save(participant);
	}
}
