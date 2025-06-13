import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { Notification, NotificationType } from 'src/entities/notification.entity';
import { Invitation, InvitationStatus, InvitationType } from 'src/entities/invitation.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		private readonly userService: UserService,
	) {}

	async inviteFriend({ from: fromId, to: toId, body }: { from: number; to: number; body?: string }) {
		const to = await this.userService.findById(toId);
		const from = await this.userService.findById(fromId);

		if (!to) {
			throw new BadRequestException('User not found');
		}

		if (toId === fromId) {
			throw new BadRequestException('You cannot invite yourself');
		}

		const alreadyInvited = from?.invitations.some((invitation) => invitation.to.id === toId && invitation.status === InvitationStatus.PENDING);
		if (alreadyInvited) {
			throw new BadRequestException('Already invited');
		}

		const isBlocked = to?.blockedList.some((user) => user.id === fromId);
		if (isBlocked) {
			throw new BadRequestException('You have been blocked by this user');
		}

		const invitation = this.invitationRepository.create({
			from: { id: fromId },
			to,
			type: InvitationType.FRIEND,
			body,
		});
		const savedInvitation = await this.invitationRepository.save(invitation);

		if (to.settings.notification.friendRequest) {
			const notification = this.notificationRepository.create({
				user: to,
				type: NotificationType.INVITATION,
				invitation: savedInvitation,
			});
			await this.notificationRepository.save(notification);
		}
		return savedInvitation;
	}

	async cancelInvitation({ userId, invitationId }: { userId: number; invitationId: number }) {
		const invitation = await this.invitationRepository.findOne({
			where: {
				id: invitationId,
				from: { id: userId },
				status: InvitationStatus.PENDING,
			},
		});

		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}

		invitation.status = InvitationStatus.CANCELED;
		await this.invitationRepository.save(invitation);

		return invitation;
	}

	async replyInvitation({ userId, invitationId, accepted }: { userId: number; invitationId: number; accepted: boolean }) {
		const invitation = await this.invitationRepository.findOne({
			where: {
				id: invitationId,
				to: { id: userId },
				status: InvitationStatus.PENDING,
			},
		});

		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}

		if (accepted) {
			invitation.status = InvitationStatus.ACCEPTED;

			invitation.from.friendList.push(invitation.to);
			invitation.to.friendList.push(invitation.from);
			await this.userRepository.save(invitation.from);
			await this.userRepository.save(invitation.to);
		} else {
			invitation.status = InvitationStatus.REJECTED;
		}

		if (invitation.from.settings.notification.friendRequestReply) {
			const notification = this.notificationRepository.create({
				user: invitation.from,
				type: NotificationType.INVITATION_REPLY,
				invitation,
			});
			await this.notificationRepository.save(notification);
		}

		await this.invitationRepository.save(invitation);

		return invitation;
	}

	async blockUser({ userId, blockedUserId }: { userId: number; blockedUserId: number }) {
		const user = await this.userService.findById(userId);
		const blockedUser = await this.userService.findById(blockedUserId);

		if (!blockedUser) {
			throw new BadRequestException('User not found');
		}

		if (user!.blockedList.some((user) => user.id === blockedUserId)) {
			throw new BadRequestException('User already blocked');
		}

		user!.blockedList.push(blockedUser);
		await this.userRepository.save(user!);

		return user;
	}

	async unblockUser({ userId, blockedUserId }: { userId: number; blockedUserId: number }) {
		const user = await this.userService.findById(userId);
		const blockedUser = await this.userService.findById(blockedUserId);

		if (!blockedUser) {
			throw new BadRequestException('User not found');
		}

		user!.blockedList = user!.blockedList.filter((user) => user.id !== blockedUserId);
		await this.userRepository.save(user!);

		return user;
	}
}
