import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/entities/user.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { Invitation, InvitationStatus, InvitationType } from 'src/entities/invitation.entity';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		private readonly userService: UserService,
		private readonly notificationService: NotificationService,
		private readonly chatService: ChatService,
	) {}

	isInvited(from: User, to: User) /*please make sure that user have invitation relations*/ {
		return from.invitations.some((invitation) => invitation.to.id === to.id && invitation.status === InvitationStatus.PENDING);
	}

	isBlocked(from: User, to: User) /*please make sure that user have blocked relations*/ {
		return from.blockedList.some((user) => user.id === to.id);
	}

	isFriend(from: User, to: User) /*please make sure that user have friend relations*/ {
		return from.friendList.some((user) => user.id === to.id);
	}

	async makeFriend(user1: User, user2: User) /*please make sure that user have friend relations*/ {
		const from = await this.userService.findById(user1.id, true);
		const to = await this.userService.findById(user2.id, true);

		if (!this.isFriend(from, to)) {
			await this.userRepository.createQueryBuilder().relation(User, 'friendList').of(from.id).add(to.id);
		}
		if (!this.isFriend(to, from)) {
			await this.userRepository.createQueryBuilder().relation(User, 'friendList').of(to.id).add(from.id);
		}
	}

	async inviteFriend({ from: fromId, to: toId, body }: { from: number; to: number; body?: string }) {
		const to = await this.userService.findById(toId, ['blockedList']);
		const from = await this.userService.findById(fromId, ['invitations', 'invitations.to']);

		if (toId === fromId) {
			throw new BadRequestException('You cannot invite yourself');
		}

		if (this.isInvited(from, to)) {
			throw new BadRequestException('Already invited');
		}

		if (this.isBlocked(to, from)) {
			throw new BadRequestException('You have been blocked by this user');
		}

		const invitation = this.invitationRepository.create({
			from: { id: fromId },
			to,
			type: InvitationType.FRIEND,
			body,
		});
		const savedInvitation = await this.invitationRepository.save(invitation);

		await this.notificationService.createNotification(
			to,
			{
				type: NotificationType.INVITATION,
				invitation: savedInvitation,
			},
			(to) => to.settings.notification.friendRequest,
		);

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
			relations: ['from', 'to', 'from.friendList', 'to.friendList', 'from.notifications'],
		});

		if (!invitation) {
			throw new BadRequestException('Invitation not found');
		}

		if (accepted) {
			invitation.status = InvitationStatus.ACCEPTED;

			await this.makeFriend(invitation.from, invitation.to);
			await this.chatService.createDirectChat(invitation.from, invitation.to);
		} else {
			invitation.status = InvitationStatus.REJECTED;
		}

		await this.notificationService.createNotification(
			invitation.from,
			{
				type: NotificationType.INVITATION_REPLY,
				invitation,
			},
			(from) => from.settings.notification.friendRequestReply,
		);

		await this.invitationRepository.save(invitation);

		return invitation;
	}

	async unfriend({ userId, friendId }: { userId: number; friendId: number }) {
		const user = await this.userService.findById(userId, true);
		const friend = await this.userService.findById(friendId, true);

		if (this.isFriend(user, friend)) {
			await this.userRepository.createQueryBuilder().relation(User, 'friendList').of(userId).remove(friendId);
			await this.userRepository.createQueryBuilder().relation(User, 'friendList').of(friendId).remove(userId);
		}

		return user;
	}

	async blockUser({ userId, blockedUserId }: { userId: number; blockedUserId: number }) {
		const user = await this.userService.findById(userId, true);
		const blockedUser = await this.userService.findById(blockedUserId);

		if (this.isBlocked(user, blockedUser)) {
			throw new BadRequestException('User already blocked');
		}

		user.blockedList.push(blockedUser);
		await this.userRepository.save(user);

		return user;
	}

	async unblockUser({ userId, blockedUserId }: { userId: number; blockedUserId: number }) {
		const user = await this.userService.findById(userId, true);
		await this.userService.findById(blockedUserId);

		user.blockedList = user.blockedList.filter((user) => user.id !== blockedUserId);
		await this.userRepository.save(user);

		return user;
	}
}
