import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getAttachmentType } from 'src/utils/fileType';

import { Message } from 'src/entities/message.entity';
import { MessageAttachment } from 'src/entities/message-attachment.entity';

@Injectable()
export class MessageService {
	constructor(
		@InjectRepository(Message)
		private readonly messageRepository: Repository<Message>,
		@InjectRepository(MessageAttachment)
		private readonly attachmentRepository: Repository<MessageAttachment>,
	) {}

	async findById(id: number) {
		const message = await this.messageRepository.findOne({ where: { id }, relations: ['sender', 'chat', 'attachments', 'reactions', 'replyTo', 'mentionedUsers', 'seenBy'] });
		if (!message) {
			throw new BadRequestException('Message not found');
		}
		return message;
	}

	async isExists(id: number) {
		const message = await this.messageRepository.findOne({ where: { id } });
		return !!message;
	}

	filesToAttachments(files?: Express.Multer.File[]) {
		return (
			files?.map((file) => ({
				type: getAttachmentType(file),
				fileName: file.filename,
				fileSize: file.size,
				fileType: file.mimetype,
			})) || []
		).map((attachment) => this.attachmentRepository.create(attachment));
	}

	async create({
		chatId,
		senderId,
		content,
		replyToId,
		mentionedUsersIds,
		files,
	}: {
		chatId: number;
		senderId: number;
		content?: string;
		replyToId?: number;
		mentionedUsersIds: number[];
		files?: Express.Multer.File[];
	}) {
		const message = this.messageRepository.create({
			chat: { id: chatId },
			sender: { id: senderId },
			content,
			replyTo: replyToId ? { id: replyToId } : undefined,
			mentionedUsers: mentionedUsersIds.map((id) => ({ id })),
			attachments: this.filesToAttachments(files),
		});
		return this.messageRepository.save(message);
	}
}
