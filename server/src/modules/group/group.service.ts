import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Transactional } from 'typeorm-transactional';

import { Chat, ChatType } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/chat-participants.entity';
import { Invitation, InvitationStatus, InvitationType } from 'src/entities/invitation.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';

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

	async isGroupParticipant(chatId: number, userId: number, activeRequired = false) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);
		return group.participants.some((participant) => participant.user.id === userId && (activeRequired ? participant.isActive : true));
		//return true if participant is found and activeRequired is false or participant is active
	}

	async findGroupParticipant(chatId: number, userId: number) {
		return this.chatService.findParticipant(chatId, userId, ChatType.GROUP);
	}

	async isGroupAdmin(chatId: number, userId: number) {
		await this.chatService.findById(chatId, false, ChatType.GROUP);
		const participant = await this.findGroupParticipant(chatId, userId);
		return participant.isAdmin;
	}

	async isGroupOwner(chatId: number, userId: number) {
		await this.chatService.findById(chatId, false, ChatType.GROUP);
		const participant = await this.findGroupParticipant(chatId, userId);
		return participant.isOwner;
	}

	@Transactional()
	async createGroupChat(ownerId: number, { name, avatar }: { name?: string; avatar?: string }) {
		const owner = await this.userService.findById(ownerId, true);

		const ownerParticipant = this.chatParticipantRepository.create({
			user: owner,
			isOwner: true,
			isAdmin: true,
		});
		//owner is also admin

		const savedOwnerParticipant = await this.chatParticipantRepository.save(ownerParticipant);

		const group = this.chatRepository.create({
			type: ChatType.GROUP,
			avatar,
			participants: [savedOwnerParticipant],
			name: name ?? `${owner.name}'s Group`, //default name is owner's name + 's Group'
		});

		const savedGroup = await this.chatRepository.save(group);

		this.logger.log(`Group chat created by ${owner.id}: ${savedGroup.id}`);

		return savedGroup;
	}

	async changeInfo({ chatId, name, avatar }: { chatId: number; name?: string; avatar?: string }) {
		const group = await this.chatService.findById(chatId, false, ChatType.GROUP);

		group.name = name ?? group.name;
		group.avatar = avatar ?? group.avatar;

		this.logger.log(`Group chat info changed for ${group.id}: ${JSON.stringify({ name, avatar })}`);

		return this.chatRepository.save(group);
	}

	@Transactional()
	async inviteMember({ chatId, fromId, toId, body }: { chatId: number; fromId: number; toId: number; body?: string }) {
		const from = await this.userService.findById(fromId);
		const to = await this.userService.findById(toId);

		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);

		if (await this.isGroupParticipant(chatId, toId)) {
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

	async addMember(chatId: number, userId: number) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);
		const user = await this.userService.findById(userId, true);

		if (await this.isGroupParticipant(chatId, userId)) {
			const participant = await this.findGroupParticipant(chatId, userId);
			if (participant.isActive) {
				//if user is already a member and active, throw error
				throw new BadRequestException('User is already a member of the group');
			}
			//if user is already a member and not active, set active to true
			participant.isActive = true;

			await this.chatParticipantRepository.save(participant);

			this.logger.log(`User ${userId} added to group ${chatId}`);

			const updatedGroup = await this.chatService.findById(chatId, true, ChatType.GROUP);

			return updatedGroup;
		}

		//if user is not a member, create new participant
		const participant = this.chatParticipantRepository.create({
			user,
			chat: group,
		});

		const savedParticipant = await this.chatParticipantRepository.save(participant);

		group.participants.push(savedParticipant);

		return this.chatRepository.save(group);
	}

	async removeMember(chatId: number, userId: number) {
		await this.chatService.findById(chatId, false, ChatType.GROUP); //check if group exists

		const participant = await this.findGroupParticipant(chatId, userId);

		//set active to false
		participant.isActive = false;

		await this.chatParticipantRepository.save(participant);

		this.logger.log(`User ${userId} removed from group ${chatId}`);

		const updatedGroup = await this.chatService.findById(chatId, true, ChatType.GROUP);

		return updatedGroup;
	}

	@Transactional()
	async replyInvitation({ chatId, invitationId, accepted }: { chatId: number; invitationId: number; accepted: boolean }) {
		await this.chatService.findById(chatId, true, ChatType.GROUP); //check if group exists
		const invitation = await this.invitationRepository.findOne({ where: { id: invitationId, group: { id: chatId }, status: InvitationStatus.PENDING } });

		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}

		if (accepted) {
			//add member to group if accepted
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
		await this.chatService.findById(chatId, false, ChatType.GROUP); //check if group exists

		const participant = await this.findGroupParticipant(chatId, userId);

		participant.isBanned = true;
		participant.isActive = false;

		await this.chatParticipantRepository.save(participant);

		this.logger.log(`User ${userId} banned from group ${chatId}`);

		const updatedGroup = await this.chatService.findById(chatId, true, ChatType.GROUP);

		return updatedGroup;
	}

	async unbanUser(chatId: number, userId: number) {
		await this.chatService.findById(chatId, false, ChatType.GROUP); //check if group exists

		const participant = await this.findGroupParticipant(chatId, userId);

		participant.isBanned = false;
		participant.isActive = true;

		await this.chatParticipantRepository.save(participant);

		this.logger.log(`User ${userId} unbanned from group ${chatId}`);

		const updatedGroup = await this.chatService.findById(chatId, true, ChatType.GROUP);

		return updatedGroup;
	}

	async changeRole({ chatId, userId, isAdmin }: { chatId: number; userId: number; isAdmin: boolean }) {
		await this.chatService.findById(chatId, false, ChatType.GROUP); //check if group exists

		const participant = await this.findGroupParticipant(chatId, userId);

		participant.isAdmin = isAdmin;
		this.logger.log(`User ${userId} changed role to ${isAdmin ? 'admin' : 'member'} in group ${chatId}`);

		await this.chatParticipantRepository.save(participant);

		const updatedGroup = await this.chatService.findById(chatId, true, ChatType.GROUP);

		return updatedGroup;
	}

	async setInviteUUIDFeature({ chatId, enabled }: { chatId: number; enabled: boolean }) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);

		group.allowInviteUUID = enabled;

		this.logger.log(`Invite UUID ${group.allowInviteUUID ? 'enabled' : 'disabled'} for group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async generateInviteUUID(chatId: number) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);

		if (!group.allowInviteUUID) {
			throw new BadRequestException('Invite UUID is not enabled for this group');
		}

		group.inviteUUID = uuidv4();
		group.inviteUUIDExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); //3 days

		this.logger.log(`Invite UUID generated for group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async revokeInviteUUID(chatId: number) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);

		group.inviteUUID = null;
		group.inviteUUIDExpiresAt = null;

		this.logger.log(`Invite UUID revoked for group ${chatId}`);

		return this.chatRepository.save(group);
	}

	async extendInviteUUID(chatId: number) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);

		if (!group.allowInviteUUID) {
			throw new BadRequestException('Invite UUID is not enabled for this group');
		}

		group.inviteUUIDExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); //3 days

		this.logger.log(`Invite UUID extended for group ${chatId}`);
	}

	@Transactional()
	async joinGroupByUUID(userId: number, { chatId, inviteUUID }: { chatId: number; inviteUUID: string }) {
		const group = await this.chatService.findById(chatId, true, ChatType.GROUP);

		if (!group.allowInviteUUID) {
			throw new BadRequestException('Invite UUID is not enabled for this group');
		}

		if (group.inviteUUID !== inviteUUID) {
			throw new BadRequestException('Invalid invite UUID');
		}

		if (group.inviteUUIDExpiresAt && group.inviteUUIDExpiresAt < new Date()) {
			throw new BadRequestException('Invite UUID has expired');
		}

		this.logger.log(`User ${userId} joined group ${chatId} by invite UUID`);
		return await this.addMember(chatId, userId);
	}
}
