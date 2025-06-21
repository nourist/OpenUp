import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Repository } from 'typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { User } from 'src/entities/user.entity';
import { ChatParticipant } from 'src/entities/chat-participants.entity';
import { UserService } from '../user/user.service';
import { Message } from 'src/entities/message.entity';
import { Transactional } from 'typeorm-transactional';
import { MessageService } from '../message/message.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from 'src/entities/notification.entity';
import { ReactionEnum } from 'src/entities/message-reaction.entity';
import { RedisService } from 'src/modules/redis/redis.service';

export type ChatRelation = 'participants' | 'participants.user' | 'lastMessage';

export const getChatRelations = (relations: boolean | ChatRelation[]): ChatRelation[] => {
	if (relations === true) return ['participants', 'participants.user', 'lastMessage'];
	if (Array.isArray(relations)) return relations;
	return [];
};

@Injectable()
export class ChatService {
	private readonly logger: Logger = new Logger(ChatService.name);

	@WebSocketServer()
	server: Server;

	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
		@InjectRepository(ChatParticipant)
		private readonly chatParticipantRepository: Repository<ChatParticipant>,
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		private readonly userService: UserService,
		private readonly messageService: MessageService,
		private readonly notificationService: NotificationService,
		private readonly redisService: RedisService,
	) {}

	async findParticipant(chatId: number, userId: number, type?: ChatType) {
		const chat = await this.findById(chatId, true, type);
		await this.userService.findById(userId);
		const participant = chat.participants.find((participant) => participant.user.id === userId);

		//immediately throw error if participant not found
		if (!participant) {
			throw new BadRequestException('Participant not found in this chat');
		}

		return participant;
	}

	async isParticipant(chatId: number, userId: number, activeRequired = false) {
		const chat = await this.findById(chatId, true);
		return chat.participants.some((participant) => participant.user.id === userId && (activeRequired ? participant.isActive : true));
		//return true if participant is found and activeRequired is false or participant is active
	}

	async findById(id: number, relations: boolean | ChatRelation[] = false, type?: ChatType) {
		const chat = await this.chatRepository.findOne({
			where: { id, ...(type ? { type } : {}) },
			relations: getChatRelations(relations),
		});

		if (!chat) {
			this.logger.log(`Chat not found for id ${id} and type ${type}`);
			//immediately throw error if chat not found
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

	async createDirectChat(from: User, to: User) {
		const existingChat = await this.findDirectChat(from, to);
		if (existingChat) {
			this.logger.log(`Direct chat already exists returning: ${existingChat.id}`);
			return existingChat;
		}

		const participant1 = this.chatParticipantRepository.create({
			user: from,
		});

		this.logger.log(`Participant 1 created: ${participant1.id}`);

		await this.chatParticipantRepository.save(participant1);

		const participant2 = this.chatParticipantRepository.create({
			user: to,
		});

		this.logger.log(`Participant 2 created: ${participant2.id}`);

		await this.chatParticipantRepository.save(participant2);

		//create direact chat with participant1 and participant2
		const chat = this.chatRepository.create({
			type: ChatType.DIRECT,
			participants: [participant1, participant2],
		});

		this.logger.log(`Chat created for user ${from.id} and user ${to.id}: ${chat.id}`);

		const redis = this.redisService.getClient();
		const toSocketId = await redis.get(`user:${to.id}:socket`);
		const fromSocketId = await redis.get(`user:${from.id}:socket`);

		const savedChat = await this.chatRepository.save(chat);

		//after chat saved, join chat to user2 to make sure that 2 users are in the same chat & can receive event
		//emit chat.create to user2 and user1
		if (toSocketId) {
			await this.server.sockets.sockets.get(toSocketId)?.join(chat.id.toString());
			this.server.to(toSocketId).emit('chat.create', savedChat);
		}
		if (fromSocketId) {
			await this.server.sockets.sockets.get(fromSocketId)?.join(chat.id.toString());
			this.server.to(fromSocketId).emit('chat.create', savedChat);
		}

		return savedChat;
	}

	async changeParticipantSettings(userId: number, { muted, pinned, chatId }: { muted?: boolean; pinned?: boolean; chatId: number }) {
		await this.findById(chatId, true); //check if chat exists

		const participant = await this.findParticipant(chatId, userId);

		participant.settings.muted = muted ?? participant.settings.muted;
		participant.settings.pinned = pinned ?? participant.settings.pinned;

		this.logger.log(`User ${userId} ${muted ? 'muted' : 'unmuted'} and ${pinned ? 'pinned' : 'unpinned'} in group ${chatId}`);

		return this.chatParticipantRepository.save(participant);
	}

	async changeNickname({ chatId, userId, nickname }: { chatId: number; userId: number; nickname: string }) {
		await this.findById(chatId, true); //check if chat exists
		await this.userService.findById(userId);

		const participant = await this.findParticipant(chatId, userId);

		participant.nickname = nickname;

		this.logger.log(`User ${userId} changed nickname to ${nickname} in group ${chatId}`);

		const savedParticipant = await this.chatParticipantRepository.save(participant);

		const redis = this.redisService.getClient();
		const userSocketId = await redis.get(`user:${userId}:socket`);

		this.server.to(chatId.toString()).emit('chat.update', await this.findById(chatId, true));
		if (userSocketId) {
			this.server.to(userSocketId).emit('participant.update', savedParticipant);
		}

		return savedParticipant;
	}

	async getMessages({ chatId, limit, before }: { chatId: number; limit?: number; before?: Date }) {
		await this.findById(chatId); //make sure that chat exists

		before = before ?? new Date(); //if before is not provided, use current date to get newest messages
		limit = limit ?? 50; //default limit is 50 messages

		//get messages before before date, order by createdAt DESC, take limit messages
		const messages = await this.messageRepository.find({
			where: {
				chat: { id: chatId },
				createdAt: LessThan(before),
				deletedAt: IsNull(),
			},
			order: { createdAt: 'DESC' },
			take: limit,
			relations: ['sender', 'attachments', 'replyTo', 'mentionedUsers', 'reactions', 'seenBy'],
		});

		this.logger.log(`Get ${messages.length} messages from chat ${chatId}`);

		return messages;
	}

	async getUnreadMessagesCount(chatId: number, userId: number) {
		//check if chat & user exists
		await this.findById(chatId, true);
		await this.userService.findById(userId);

		return this.messageRepository
			.createQueryBuilder('message')
			.leftJoin('message.seenBy', 'seenBy')
			.where('message.chatId = :chatId', { chatId })
			.andWhere('message.senderId != :userId', { userId })
			.andWhere('message.deletedAt IS NULL')
			.andWhere((qb) => {
				const subQuery = qb.subQuery().select('msg.id').from(Message, 'msg').leftJoin('msg.seenBy', 'sb').where('sb.id = :userId').getQuery();
				return 'message.id NOT IN ' + subQuery;
			})
			.getCount();
	}

	async updateLastMessage(chatId: number, message: Message | null) {
		const chat = await this.findById(chatId, true);
		chat.lastMessage = message;
		return this.chatRepository.save(chat);
	}

	async getMentionedUsers({ content, chatId, userId }: { content?: string; chatId: number; userId: number }) {
		if (!content) return [];

		let mentionedUsersIds: number[] = [];

		mentionedUsersIds.push(...(content.match(/@(\d+)/g)?.map((id) => +id.slice(1)) || []));
		if (content.includes('@all')) {
			const chat = await this.findById(chatId, true);
			mentionedUsersIds = chat.participants.map((participant) => participant.user.id).filter((id) => id !== userId);
		}
		mentionedUsersIds = [...new Set(mentionedUsersIds)];
		mentionedUsersIds = mentionedUsersIds.filter((id) => id !== userId);
		mentionedUsersIds = (await Promise.all(
			mentionedUsersIds
				.map(async (id) => {
					if (await this.isParticipant(chatId, id).catch(() => false)) {
						return id;
					}
					return null;
				})
				.filter((id) => id != null),
		)) as number[];

		return mentionedUsersIds;
	}

	@Transactional()
	async addMessage({ chatId, userId, content, replyToId, files }: { chatId: number; userId: number; content?: string; replyToId?: number; files?: Express.Multer.File[] }) {
		//chat id and user id was checked in guard
		//check if replyTo message is exists
		if (replyToId) {
			await this.messageService.findById(replyToId); //auto throw error if message not found
		}

		if (!content && !files?.length) {
			throw new BadRequestException('Content or files are required');
		}

		//get mentioned users ids from content
		const mentionedUsersIds = await this.getMentionedUsers({ content, chatId, userId });

		const message = await this.messageService.create({ chatId, senderId: userId, content, replyToId, mentionedUsersIds, files });

		this.logger.log(`Message ${message.id} created in chat ${chatId}`);

		//update last message in chat
		await this.updateLastMessage(chatId, message);

		this.logger.log(`Last message in chat ${chatId} updated to ${message.id}`);

		//create notification for mentioned users
		await this.notificationService.createNotificationForMentionedUsers(message.mentionedUsers, message);

		this.logger.log(`Notification for mentioned users created`);

		//create notification for replyTo message
		if (message.replyTo) {
			const replyToMessage = await this.messageService.findById(message.replyTo.id);
			await this.notificationService.createNotification(
				replyToMessage.sender,
				{
					type: NotificationType.REPLY,
					message: message,
				},
				(user) => user.settings.notification.reply,
			);
			this.logger.log(`Notification for replyTo message created`);
		}

		this.server.to(chatId.toString()).emit('message.create', message);

		return message;
	}

	@Transactional()
	async editMessage({
		messageId,
		chatId,
		content,
		files,
		attachments,
		removeReplyTo,
	}: {
		messageId: number;
		chatId: number;
		content?: string;
		files?: Express.Multer.File[];
		attachments?: { id: number }[];
		removeReplyTo?: boolean;
	}) {
		//chat & user id was checked in guard
		//sender id was checked in guard

		const message = await this.messageService.findById(messageId);

		if (message.chat.id !== chatId) {
			throw new BadRequestException('Message not found in this chat');
		}

		//mark message as edited
		message.isEdited = true;

		//update content
		if (content) message.content = content;

		//update replyToId
		if (removeReplyTo) message.replyTo = null;

		//remove attachments that are not in attachments array, if attachments is not provided, remove all previous attachments
		message.attachments = message.attachments.filter((attachment) => !attachments?.some((a) => a.id === attachment.id));

		//add new attachments
		if (files) message.attachments.push(...this.messageService.filesToAttachments(files));

		const newMentionedUsersIds = await this.getMentionedUsers({ content, chatId: message.chat.id, userId: message.sender.id });
		newMentionedUsersIds.filter((id) => !message.mentionedUsers.some((user) => user.id === id));

		//create notification for mentioned users
		await this.notificationService.createNotificationForMentionedUsers(
			newMentionedUsersIds.map((id) => ({ id })),
			message,
		);

		//update mentionedUsers
		message.mentionedUsers.push(...(await Promise.all(newMentionedUsersIds.map((id) => this.userService.findById(id)))));

		//update message
		const savedMessage = await this.messageRepository.save(message);

		this.server.to(chatId.toString()).emit('message.update', savedMessage);

		return savedMessage;
	}

	@Transactional()
	async deleteMessage({ chatId, messageId }: { chatId: number; messageId: number }) {
		await this.messageRepository.softDelete(messageId);
		this.logger.log(`Message ${messageId} deleted`);

		await this.updateLastMessage(
			chatId,
			(await this.getMessages({ chatId, limit: 1 })
				.catch(() => [])
				.then((messages) => messages[0])) || null,
		);

		this.logger.log(`Last message in chat ${chatId} updated`);

		this.server.to(chatId.toString()).emit('message.delete', messageId);

		return true;
	}

	async seenMessage({ chatId, messageId, userId }: { chatId: number; messageId: number; userId: number }) {
		const message = await this.messageService.findById(messageId);
		await this.findById(chatId, true);
		if (message.chat.id !== chatId) {
			this.logger.log(`Message ${messageId} not found in chat ${chatId}`);
			throw new BadRequestException('Message not found in this chat');
		}

		if (message.sender.id === userId) return true;
		if (message.seenBy.some((seenBy) => seenBy.id === userId)) return true;

		message.seenBy.push(await this.userService.findById(userId));
		await this.messageRepository.save(message);
		this.logger.log(`Message ${messageId} seen by user ${userId}`);
		return true;
	}

	async reactMessage({ chatId, messageId, userId, emoji }: { chatId: number; messageId: number; userId: number; emoji: ReactionEnum }) {
		const message = await this.messageService.findById(messageId);

		if (message.sender.id === userId) {
			throw new BadRequestException('You cannot react to your own message');
		}

		if (message.chat.id !== chatId) {
			this.logger.log(`Message ${messageId} not found in chat ${chatId}`);
			throw new BadRequestException('Message not found in this chat');
		}

		const savedMessage = await this.messageService.react({ messageId, userId, emoji });

		//emit message.update to chat participants
		this.server.to(chatId.toString()).emit('message.update', savedMessage);

		this.logger.log(`Message ${messageId} reacted by user ${userId} with emoji ${emoji}`);

		await this.notificationService.createNotification(
			message.sender,
			{
				type: NotificationType.REACTION,
				message,
				reaction: message.reactions.find((reaction) => reaction.user.id === userId),
			},
			(user) => user.settings.notification.reaction,
		);

		this.logger.log(`Notification for reaction created for user ${message.sender.id}`);

		return true;
	}
}
