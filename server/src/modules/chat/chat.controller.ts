import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';

import { ChatService } from './chat.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { AddMessageDto, ChangeNicknameDto, EditMessageDto, GetMessagesDto, AddReactionDto } from './chat.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { IsChatParticipantGuard, IsMessageSenderGuard } from 'src/guards/chat-role.guard';
import { fileFilter } from 'src/utils/fileType';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Patch(':chatId/mute')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async muteChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat muted',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, muted: true })),
		};
	}

	@Patch(':chatId/unmute')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async unmuteChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat unmuted',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, muted: false })),
		};
	}

	@Patch(':chatId/pin')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async pinChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat pinned',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, pinned: true })),
		};
	}

	@Patch(':chatId/unpin')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async unpinChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat unpinned',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, pinned: false })),
		};
	}

	@Patch(':chatId/nickname')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async changeNickname(@Param('chatId', ParseIntPipe) chatId: number, @Body() body: ChangeNicknameDto) {
		return {
			message: 'Chat nickname changed',
			participant: instanceToPlain(await this.chatService.changeNickname({ chatId, ...body })),
		};
	}

	@Get(':chatId/message')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async getMessages(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Query() query: GetMessagesDto) {
		return {
			messages: instanceToPlain(await this.chatService.getMessages({ ...query, chatId })),
			unreadMessagesCount: await this.chatService.getUnreadMessagesCount(chatId, user.sub),
		};
	}

	@Post(':chatId/message')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	@UseInterceptors(
		FilesInterceptor('files', 10, {
			fileFilter,
			storage: diskStorage({
				destination: (req, file, cb) => {
					const chatId = req.params.chatId;
					const uploadPath = `./uploads/${chatId}`;

					if (!existsSync(uploadPath)) {
						mkdirSync(uploadPath, { recursive: true });
					}

					cb(null, uploadPath);
				},
				filename: (req, file, cb) => {
					const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
					cb(null, uniqueName);
				},
			}),
		}),
	)
	async addMessage(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @UploadedFiles() files: Express.Multer.File[], @Body() body: AddMessageDto) {
		return {
			message: instanceToPlain(await this.chatService.addMessage({ chatId, userId: user.sub, ...body, files })),
		};
	}

	@Delete(':chatId/message/:messageId')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsMessageSenderGuard)
	async deleteMessage(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('messageId', ParseIntPipe) messageId: number) {
		return {
			message: 'Message deleted',
			success: await this.chatService.deleteMessage({ chatId, messageId }),
		};
	}

	@Patch(':chatId/message/:messageId')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsMessageSenderGuard)
	async editMessage(
		@GetUser() user: JwtPayload,
		@Param('chatId', ParseIntPipe) chatId: number,
		@Param('messageId', ParseIntPipe) messageId: number,
		@Body() body: EditMessageDto,
	) {
		return {
			message: 'Message edited',
			success: await this.chatService.editMessage({ messageId, chatId, ...body }),
		};
	}

	@Patch(':chatId/message/:messageId/seen')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async seenMessage(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('messageId', ParseIntPipe) messageId: number) {
		return {
			message: 'Message seen',
			success: await this.chatService.seenMessage({ chatId, messageId, userId: user.sub }),
		};
	}

	@Post(':chatId/message/:messageId/react')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async reactMessage(
		@GetUser() user: JwtPayload,
		@Param('chatId', ParseIntPipe) chatId: number,
		@Param('messageId', ParseIntPipe) messageId: number,
		@Body() body: AddReactionDto,
	) {
		return {
			message: 'Reaction added',
			success: await this.chatService.reactMessage({ chatId, messageId, userId: user.sub, ...body }),
		};
	}
}
