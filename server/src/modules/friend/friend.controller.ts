import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { FriendService } from './friend.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { InviteFriendDto } from './friend.dto';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post('/invite/:to')
	@UseGuards(JwtAuthGuard)
	async inviteFriend(@GetUser() user: JwtPayload, @Param('to', ParseIntPipe) to: number, @Body() body: InviteFriendDto) {
		return {
			message: 'Invitation sent',
			data: instanceToPlain(await this.friendService.inviteFriend({ to, from: user.sub, body: body?.body })),
		};
	}

	@Delete('/invite/:invitationId')
	@UseGuards(JwtAuthGuard)
	async cancelInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation canceled',
			data: instanceToPlain(await this.friendService.cancelInvitation({ invitationId, userId: user.sub })),
		};
	}

	@Patch('/invite/:invitationId/accepted')
	@UseGuards(JwtAuthGuard)
	async acceptInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation accepted',
			data: instanceToPlain(await this.friendService.replyInvitation({ invitationId, accepted: true, userId: user.sub })),
		};
	}

	@Patch('/invite/:invitationId/rejected')
	@UseGuards(JwtAuthGuard)
	async rejectInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation rejected',
			data: instanceToPlain(await this.friendService.replyInvitation({ invitationId, accepted: false, userId: user.sub })),
		};
	}

	@Delete('/unfriend/:friendId')
	@UseGuards(JwtAuthGuard)
	async unfriend(@GetUser() user: JwtPayload, @Param('friendId', ParseIntPipe) friendId: number) {
		return {
			message: 'Unfriended',
			user: instanceToPlain(await this.friendService.unfriend({ friendId, userId: user.sub })),
		};
	}

	@Patch('/block/:blockedUserId')
	@UseGuards(JwtAuthGuard)
	async blockUser(@GetUser() user: JwtPayload, @Param('blockedUserId', ParseIntPipe) blockedUserId: number) {
		return {
			message: 'User blocked',
			user: instanceToPlain(await this.friendService.blockUser({ blockedUserId, userId: user.sub })),
		};
	}

	@Patch('/unblock/:blockedUserId')
	@UseGuards(JwtAuthGuard)
	async unblockUser(@GetUser() user: JwtPayload, @Param('blockedUserId', ParseIntPipe) blockedUserId: number) {
		return {
			message: 'User unblocked',
			user: instanceToPlain(await this.friendService.unblockUser({ blockedUserId, userId: user.sub })),
		};
	}
}
