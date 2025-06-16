import { Body, Controller, UseGuards, Post, Patch, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { GroupService } from './group.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { GetUser } from 'src/decorators/get-user.decorator';
import { ChangeGroupInfoDto, CreateGroupDto, InviteToGroupDto } from './group.dto';
import { InvitationService } from '../invitation/invitation.service';
import { IsGroupAdminGuard, IsGroupOwnerGuard, IsChatParticipantGuard } from 'src/guards/chat-role.guard';

@Controller('group')
export class GroupController {
	constructor(
		private readonly groupService: GroupService,
		private readonly invitationService: InvitationService,
	) {}

	@Post()
	@UseGuards(JwtAuthGuard)
	async createGroup(@GetUser() user: JwtPayload, @Body() body: CreateGroupDto) {
		return {
			message: 'Group created',
			chat: instanceToPlain(await this.groupService.createGroupChat(user.sub, body)),
		};
	}

	@Patch(':chatId')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async changeGroupInfo(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Body() body: ChangeGroupInfoDto) {
		return {
			message: 'Group info changed',
			chat: instanceToPlain(await this.groupService.changeInfo({ chatId, ...body })),
		};
	}

	@Post(':chatId/invite')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async inviteToGroup(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Body() body: InviteToGroupDto) {
		return {
			message: 'Invitation sent',
			invitation: instanceToPlain(await this.groupService.inviteMember({ chatId, fromId: user.sub, toId: body.to, body: body.body })),
		};
	}

	@Delete(':chatId/invite/:invitationId')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async cancelInvitation(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation canceled',
			invitation: instanceToPlain(await this.invitationService.cancel({ chatId, invitationId, userId: user.sub })),
		};
	}

	@Patch('invite/:invitationId/accepted')
	@UseGuards(JwtAuthGuard)
	async acceptInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation accepted',
			invitation: instanceToPlain(await this.groupService.replyInvitation({ invitationId, accepted: true })),
		};
	}

	@Patch('invite/:invitationId/rejected')
	@UseGuards(JwtAuthGuard)
	async rejectInvitation(@GetUser() user: JwtPayload, @Param('invitationId', ParseIntPipe) invitationId: number) {
		return {
			message: 'Invitation rejected',
			invitation: instanceToPlain(await this.groupService.replyInvitation({ invitationId, accepted: false })),
		};
	}

	@Patch(':chatId/member/:userId/kick')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async kickUser(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		return {
			message: 'User kicked',
			chat: instanceToPlain(await this.groupService.removeMember(chatId, userId)),
		};
	}

	@Patch(':chatId/member/:userId/ban')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async banUser(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		return {
			message: 'User banned',
			chat: instanceToPlain(await this.groupService.banUser(chatId, userId)),
		};
	}

	@Patch(':chatId/member/:userId/unban')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async unbanUser(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		return {
			message: 'User unbanned',
			chat: instanceToPlain(await this.groupService.unbanUser(chatId, userId)),
		};
	}

	@Post(':chatId/admin/:userId')
	@UseGuards(JwtAuthGuard, IsGroupOwnerGuard)
	async setAdmin(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		return {
			message: 'User set as admin',
			chat: instanceToPlain(await this.groupService.changeRole({ chatId, userId, isAdmin: true })),
		};
	}

	@Delete(':chatId/admin/:userId')
	@UseGuards(JwtAuthGuard, IsGroupOwnerGuard)
	async removeAdmin(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		return {
			message: 'Admin removed',
			chat: instanceToPlain(await this.groupService.changeRole({ chatId, userId, isAdmin: false })),
		};
	}

	@Patch(':chatId/invite-uuid/enable')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async enableInviteUUID(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Invite UUID enabled',
			chat: instanceToPlain(await this.groupService.setInviteUUIDFeature({ chatId, enabled: true })),
		};
	}

	@Patch(':chatId/invite-uuid/disable')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async disableInviteUUID(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Invite UUID disabled',
			chat: instanceToPlain(await this.groupService.setInviteUUIDFeature({ chatId, enabled: false })),
		};
	}

	@Post(':chatId/invite-uuid')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async generateInviteUUID(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Invite UUID generated',
			chat: instanceToPlain(await this.groupService.generateInviteUUID(chatId)),
		};
	}

	@Patch(':chatId/invite-uuid')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async extendInviteUUID(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Invite UUID extended',
			chat: instanceToPlain(await this.groupService.extendInviteUUID(chatId)),
		};
	}

	@Delete(':chatId/invite-uuid')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard, IsGroupAdminGuard)
	async revokeInviteUUID(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Invite UUID revoked',
			chat: instanceToPlain(await this.groupService.revokeInviteUUID(chatId)),
		};
	}

	@Post('join/:inviteUUID')
	@UseGuards(JwtAuthGuard)
	async joinGroup(@GetUser() user: JwtPayload, @Param('inviteUUID') inviteUUID: string) {
		return {
			message: 'Group joined',
			chat: instanceToPlain(await this.groupService.joinGroupByUUID(user.sub, inviteUUID)),
		};
	}

	@Delete(':chatId/leave')
	@UseGuards(JwtAuthGuard, IsChatParticipantGuard)
	async leaveGroup(@GetUser() user: JwtPayload, @Param('chatId', ParseIntPipe) chatId: number) {
		return {
			message: 'Group left',
			chat: instanceToPlain(await this.groupService.removeMember(chatId, user.sub)),
		};
	}
}
