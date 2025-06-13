import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { FriendService } from './friend.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { BlockUserDto, CancelInvitationDto, InviteFriendDto, ReplyInvitationDto, UnblockUserDto } from './friend.dto';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post('/invite')
	@UseGuards(JwtAuthGuard)
	async inviteFriend(@GetUser() user: JwtPayload, @Body() body: InviteFriendDto) {
		return {
			message: 'Invitation sent',
			data: instanceToPlain(await this.friendService.inviteFriend({ ...body, from: user.sub })),
		};
	}

	@Post('/invite/cancel')
	@UseGuards(JwtAuthGuard)
	async cancelInvitation(@GetUser() user: JwtPayload, @Body() body: CancelInvitationDto) {
		return {
			message: 'Invitation canceled',
			data: instanceToPlain(await this.friendService.cancelInvitation({ ...body, userId: user.sub })),
		};
	}

	@Post('/invite/reply')
	@UseGuards(JwtAuthGuard)
	async replyInvitation(@GetUser() user: JwtPayload, @Body() body: ReplyInvitationDto) {
		return {
			message: 'Invitation replied',
			data: instanceToPlain(await this.friendService.replyInvitation({ ...body, userId: user.sub })),
		};
	}

	@Post('/block')
	@UseGuards(JwtAuthGuard)
	async blockUser(@GetUser() user: JwtPayload, @Body() body: BlockUserDto) {
		return {
			message: 'User blocked',
			data: instanceToPlain(await this.friendService.blockUser({ ...body, userId: user.sub })),
		};
	}

	@Post('/unblock')
	@UseGuards(JwtAuthGuard)
	async unblockUser(@GetUser() user: JwtPayload, @Body() body: UnblockUserDto) {
		return {
			message: 'User unblocked',
			data: instanceToPlain(await this.friendService.unblockUser({ ...body, userId: user.sub })),
		};
	}
}
