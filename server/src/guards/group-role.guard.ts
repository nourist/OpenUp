import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GroupService } from 'src/modules/group/group.service';
import { Request } from 'express';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class IsGroupMemberGuard implements CanActivate {
	constructor(private readonly groupService: GroupService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // get from jwt
		const chatId: number = +req.params.chatId || (req.body as { chatId: number }).chatId; // get chatId from params or body

		if (!chatId) {
			throw new ForbiddenException('Chat ID is required');
		}

		const isMember = await this.groupService.isGroupParticipant(chatId, user.sub, true /*only accept active member*/);

		if (!isMember) {
			throw new ForbiddenException('You are not a member of the group');
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
