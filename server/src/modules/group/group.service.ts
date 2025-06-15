import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/chatParticipants.entity';
import { ChatService } from '../chat/chat.service';
import { Invitation, InvitationStatus, InvitationType } from 'src/entities/invitation.entity';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from 'src/entities/notification.entity';

@Injectable()
export class GroupService {
	private readonly logger: Logger = new Logger(GroupService.name);

	constructor(
		@InjectRepository(Chat)
		private readonly chatRepository: Repository<Chat>,
		@InjectRepository(ChatParticipant)
		private readonly chatParticipantRepository: Repository<ChatParticipant>,
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		private readonly userService: UserService,
		private readonly chatService: ChatService,
		private readonly notificationService: NotificationService,
	) {}

	async createGroupChat(ownerId: number, { name, avatar }: { name?: string; avatar?: string }) {
		const owner = await this.userService.findById(ownerId, true);

		const ownerParticipant = this.chatParticipantRepository.create({
			user: owner,
			isOwner: true,
		});

		const savedOwnerParticipant = await this.chatParticipantRepository.save(ownerParticipant);

		const group = this.chatRepository.create({
			type: ChatType.GROUP,
			avatar,
			participants: [savedOwnerParticipant],
			name: name ?? `${owner.name}'s Group`,
		});

		const savedGroup = await this.chatRepository.save(group);

		this.logger.log(`Group chat created by ${owner.id}: ${savedGroup.id}`);

		return savedGroup;
	}

	async changeInfo({ chatId, name, avatar }: { chatId: number; name?: string; avatar?: string }) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP);

		group.name = name ?? group.name;
		group.avatar = avatar ?? group.avatar;

		this.logger.log(`Group chat info changed for ${group.id}: ${JSON.stringify({ name, avatar })}`);

		return this.chatRepository.save(group);
	}

	async inviteMember({ chatId, fromId, toId, body }: { chatId: number; fromId: number; toId: number; body?: string }) {
		const from = await this.userService.findById(fromId);
		const to = await this.userService.findById(toId);

		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);

		if (await this.isParticipant(chatId, toId)) {
			throw new BadRequestException('User is already a member of the group');
		}

		const invitation = this.invitationRepository.create({
			type: InvitationType.GROUP,
			from,
			to,
			group,
			body,
		});

		const savedInvitation = await this.invitationRepository.save(invitation);
		this.logger.log(`Invitation created: ${savedInvitation.id}`);

		await this.notificationService.createNotification(to, { type: NotificationType.INVITATION, invitation: savedInvitation }, (to) => to.settings.notification.groupInvitation);
		this.logger.log(`Invitation sent to ${to.id} from ${from.id} for group ${group.id}`);

		group.invitations.push(savedInvitation);
		return this.chatRepository.save(group);
	}

	async isParticipant(chatId: number, userId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		return group.participants.some((participant) => participant.user.id === userId);
	}

	async findParticipant(chatId: number, userId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		const participant = group.participants.find((participant) => participant.user.id === userId);

		if (!participant) {
			throw new BadRequestException('Participant not found');
		}

		return participant;
	}

	async addMember(chatId: number, userId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		const user = await this.userService.findById(userId, true);

		if (await this.isParticipant(chatId, userId)) {
			const participant = await this.findParticipant(chatId, userId);
			if (participant.isActive) {
				throw new BadRequestException('User is already a member of the group');
			}
			participant.isActive = true;

			this.logger.log(`User ${userId} added to group ${chatId}`);

			return this.chatRepository.save(group);
		}

		const participant = this.chatParticipantRepository.create({
			user,
			chat: group,
		});

		const savedParticipant = await this.chatParticipantRepository.save(participant);

		group.participants.push(savedParticipant);

		return this.chatRepository.save(group);
	}

	async removeMember(chatId: number, userId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		await this.userService.findById(userId);

		const participant = await this.findParticipant(chatId, userId);

		if (!participant) {
			throw new BadRequestException('User is not a member of the group');
		}

		participant.isActive = false;

		this.logger.log(`User ${userId} removed from group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async cancelInvitation({ chatId, invitationId }: { chatId: number; invitationId: number }) {
		await this.chatService.findById(chatId, ChatType.GROUP, true);
		const invitation = await this.invitationRepository.findOne({ where: { id: invitationId, group: { id: chatId } } });

		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}

		invitation.status = InvitationStatus.CANCELED;

		this.logger.log(`Invitation ${invitationId} canceled for group ${chatId}`);

		return this.invitationRepository.save(invitation);
	}

	async replyInvitation({ chatId, invitationId, accepted }: { chatId: number; invitationId: number; accepted: boolean }) {
		await this.chatService.findById(chatId, ChatType.GROUP, true);
		const invitation = await this.invitationRepository.findOne({ where: { id: invitationId, group: { id: chatId }, status: InvitationStatus.PENDING } });

		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}

		if (accepted) {
			await this.addMember(chatId, invitation.to.id);

			invitation.status = InvitationStatus.ACCEPTED;
		} else {
			invitation.status = InvitationStatus.REJECTED;
		}

		this.logger.log(`Invitation ${invitationId} ${accepted ? 'accepted' : 'rejected'} for group ${chatId}`);

		const savedInvitation = await this.invitationRepository.save(invitation);

		await this.notificationService.createNotification(
			invitation.from,
			{ type: NotificationType.INVITATION, invitation: savedInvitation },
			(from) => from.settings.notification.groupInvitationReply,
		);

		return savedInvitation;
	}

	async banUser(chatId: number, userId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		await this.userService.findById(userId);

		const participant = await this.findParticipant(chatId, userId);

		if (!participant) {
			throw new BadRequestException('User is not a member of the group');
		}

		participant.isBanned = true;
		participant.isActive = false;

		this.logger.log(`User ${userId} banned from group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async changeNickname({ chatId, userId, nickname }: { chatId: number; userId: number; nickname: string }) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		await this.userService.findById(userId);

		const participant = await this.findParticipant(chatId, userId);

		if (!participant) {
			throw new BadRequestException('User is not a member of the group');
		}

		participant.nickname = nickname;

		this.logger.log(`User ${userId} changed nickname to ${nickname} in group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async changeRole({ chatId, userId, isAdmin }: { chatId: number; userId: number; isAdmin: boolean }) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);
		await this.userService.findById(userId);

		const participant = await this.findParticipant(chatId, userId);

		if (!participant) {
			throw new BadRequestException('User is not a member of the group');
		}

		participant.isAdmin = isAdmin;
		this.logger.log(`User ${userId} changed role to ${isAdmin ? 'admin' : 'member'} in group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async changeParticipantSettings(userId: number, { muted, pinned, chatId }: { muted?: boolean; pinned?: boolean; chatId: number }) {
		await this.chatService.findById(chatId, ChatType.GROUP, true);

		const participant = await this.findParticipant(chatId, userId);

		if (!participant) {
			throw new BadRequestException('User is not a member of the group');
		}

		participant.settings.muted = muted ?? participant.settings.muted;
		participant.settings.pinned = pinned ?? participant.settings.pinned;

		this.logger.log(`User ${userId} ${muted ? 'muted' : 'unmuted'} and ${pinned ? 'pinned' : 'unpinned'} in group ${chatId}`);

		return this.chatParticipantRepository.save(participant);
	}

	async setInviteUUIDFeature({ chatId, enabled }: { chatId: number; enabled: boolean }) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);

		group.allowInviteUUID = enabled;

		this.logger.log(`Invite UUID ${group.allowInviteUUID ? 'enabled' : 'disabled'} for group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async generateInviteUUID(chatId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);

		if (!group.allowInviteUUID) {
			throw new BadRequestException('Invite UUID is not enabled for this group');
		}

		group.inviteUUID = uuidv4();
		group.inviteUUIDExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);

		this.logger.log(`Invite UUID generated for group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async revokeInviteUUID(chatId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);

		group.inviteUUID = null;
		group.inviteUUIDExpiresAt = null;

		this.logger.log(`Invite UUID revoked for group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async extendInviteUUID(chatId: number) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);

		if (!group.allowInviteUUID) {
			throw new BadRequestException('Invite UUID is not enabled for this group');
		}

		group.inviteUUIDExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3);

		this.logger.log(`Invite UUID extended for group ${chatId}`);
	}

	async joinGroupByUUID(userId: number, { chatId, inviteUUID }: { chatId: number; inviteUUID: string }) {
		const group = await this.chatService.findById(chatId, ChatType.GROUP, true);

		if (!group.allowInviteUUID) {
			throw new BadRequestException('Invite UUID is not enabled for this group');
		}

		if (group.inviteUUID !== inviteUUID) {
			throw new BadRequestException('Invalid invite UUID');
		}

		if (group.inviteUUIDExpiresAt && group.inviteUUIDExpiresAt < new Date()) {
			throw new BadRequestException('Invite UUID has expired');
		}

		await this.addMember(chatId, userId);

		this.logger.log(`User ${userId} joined group ${chatId} by invite UUID`);

		return this.chatRepository.save(group);
	}
}
