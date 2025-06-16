import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/types/jwt-payload.interface';
import { ChatService } from 'src/modules/chat/chat.service';

@Injectable()
export class IsChatParticipantGuard implements CanActivate {
	constructor(private readonly chatService: ChatService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // get from jwt
		const chatId: number = +req.params.chatId || (req.body as { chatId: number }).chatId; // get chatId from params or body

		if (!chatId) {
			throw new ForbiddenException('Chat ID is required');
		}

		const isMember = await this.chatService.isParticipant(chatId, user.sub, true /*only accept active member*/);

		if (!isMember) {
			throw new ForbiddenException('You are not a member of the chat');
		}

		return true;
	}
}
