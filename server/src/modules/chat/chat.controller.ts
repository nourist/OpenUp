import { Body, Controller, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { ChatService } from './chat.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { ChangeNicknameDto } from './chat.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
	constructor(private readonly chatService: ChatService) {}

	@Patch(':chatId/mute')
	@UseGuards(JwtAuthGuard)
	async muteChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat muted',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, muted: true })),
		};
	}

	@Patch(':chatId/unmute')
	@UseGuards(JwtAuthGuard)
	async unmuteChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat unmuted',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, muted: false })),
		};
	}

	@Patch(':chatId/pin')
	@UseGuards(JwtAuthGuard)
	async pinChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat pinned',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, pinned: true })),
		};
	}

	@Patch(':chatId/unpin')
	@UseGuards(JwtAuthGuard)
	async unpinChat(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Chat unpinned',
			participant: instanceToPlain(await this.chatService.changeParticipantSettings(user.sub, { chatId, pinned: false })),
		};
	}

	@Patch(':chatId/nickname')
	@UseGuards(JwtAuthGuard)
	async changeNickname(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Body() body: ChangeNicknameDto) {
		return {
			message: 'Chat nickname changed',
			participant: instanceToPlain(await this.chatService.changeNickname({ chatId, userId: user.sub, nickname: body.nickname })),
		};
	}
}
