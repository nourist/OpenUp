import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { FriendService } from './friend.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { InviteFriendDto } from './friend.dto';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { InvitationService } from '../invitation/invitation.service';

@Controller('friend')
export class FriendController {
	constructor(
		private readonly friendService: FriendService,
		private readonly invitationService: InvitationService,
	) {}

	@Post('/invite')
	@UseGuards(JwtAuthGuard)
	async inviteFriend(@GetUser() user: JwtPayload, @Body() body: InviteFriendDto) {
		return {
			message: 'Invitation sent',
			invitation: instanceToPlain(await this.friendService.inviteFriend({ from: user.sub, ...body })),
		};
	}

	@Delete('/invite/:invitationId')
	@UseGuards(JwtAuthGuard)
	async cancelInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation canceled',
			invitation: instanceToPlain(await this.invitationService.cancel({ invitationId, userId: user.sub })),
		};
	}

	@Patch('/invite/:invitationId/accepted')
	@UseGuards(JwtAuthGuard)
	async acceptInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation accepted',
			invitation: instanceToPlain(await this.friendService.replyInvitation({ invitationId, accepted: true, userId: user.sub })),
		};
	}

	@Patch('/invite/:invitationId/rejected')
	@UseGuards(JwtAuthGuard)
	async rejectInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation rejected',
			invitation: instanceToPlain(await this.friendService.replyInvitation({ invitationId, accepted: false, userId: user.sub })),
		};
	}

	@Delete('/unfriend/:friendId')
	@UseGuards(JwtAuthGuard)
	async unfriend(@GetUser() user: JwtPayload, @Param('friendId', ParseIntPipe) friendId: number) {
		return {
			message: 'Unfriended',
			success: await this.friendService.unfriend({ friendId, userId: user.sub }),
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
