import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { FriendService } from './friend.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { InviteFriendDto } from './friend.dto';
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
}
