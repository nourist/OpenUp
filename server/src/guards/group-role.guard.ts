import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GroupService } from 'src/modules/group/group.service';
import { Request } from 'express';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class IsGroupMemberGuard implements CanActivate {
	constructor(private readonly groupService: GroupService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // lấy từ JWT
		const chatId: number = +req.params.chatId || (req.body as { chatId: number }).chatId;

		if (!chatId) {
			throw new ForbiddenException('Chat ID is required');
		}

		const isMember = await this.groupService.isGroupParticipant(chatId, user.sub);

		if (!isMember) {
			throw new ForbiddenException('You are not a member of the group');
		}

		return true;
	}
}

@Injectable()
export class IsGroupAdminGuard implements CanActivate {
	constructor(private readonly groupService: GroupService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // lấy từ JWT
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
	constructor(private readonly groupService: GroupService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // lấy từ JWT
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
