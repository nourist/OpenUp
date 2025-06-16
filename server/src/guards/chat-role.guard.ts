import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/types/jwt-payload.interface';
import { ChatService } from 'src/modules/chat/chat.service';
import { GroupService } from 'src/modules/group/group.service';
import { MessageService } from 'src/modules/message/message.service';

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

@Injectable()
export class IsGroupAdminGuard implements CanActivate {
	//require isGroupMemberGuard before this guard to check if user active
	constructor(private readonly groupService: GroupService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // get from jwt
		const chatId: number = +req.params.chatId || (req.body as { chatId: number }).chatId;

		if (!chatId) {
			throw new ForbiddenException('Chat ID is required');
		}

		const isAdmin = await this.groupService.isGroupAdmin(chatId, user.sub);

		if (!isAdmin) {
			throw new ForbiddenException('You are not the group admin');
		}

		return true;
	}
}

@Injectable()
export class IsGroupOwnerGuard implements CanActivate {
	//do not require isGroupMemberGuard before this guard to check if user active
	//because owner always active
	constructor(private readonly groupService: GroupService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // get from jwt
		const chatId: number = +req.params.chatId || (req.body as { chatId: number }).chatId;

		if (!chatId) {
			throw new ForbiddenException('Chat ID is required');
		}

		const isOwner = await this.groupService.isGroupOwner(chatId, user.sub);

		if (!isOwner) {
			throw new ForbiddenException('You are not the group owner');
		}

		return true;
	}
}

@Injectable()
export class IsMessageSenderGuard implements CanActivate {
	//require isChatParticipantGuard before this guard to check if user is participant and active
	constructor(private readonly messageService: MessageService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // get from jwt
		const messageId: number = +req.params.messageId || (req.body as { messageId: number }).messageId;

		const message = await this.messageService.findById(messageId);

		if (message.sender.id !== user.sub) {
			throw new ForbiddenException('You are not the message sender');
		}

		return true;
	}
}
