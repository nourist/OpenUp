import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { User } from 'src/entities/user.entity';
import { NotificationType } from 'src/entities/notification.entity';
import { Invitation, InvitationStatus, InvitationType } from 'src/entities/invitation.entity';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notification/notification.service';
import { ChatService } from '../chat/chat.service';
import { RedisService } from '../redis/redis.service';
import { FriendGateway } from './friend.gateway';

@Injectable()
export class FriendService {
	private readonly logger: Logger = new Logger(FriendService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		private readonly userService: UserService,
		private readonly notificationService: NotificationService,
		private readonly chatService: ChatService,
		private readonly redisService: RedisService,
		private readonly friendGateway: FriendGateway,
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
		this.logger.log(`User ${from.id} is now friends with user ${to.id}`);
	}

	@Transactional()
	async inviteFriend({ from: fromId, to: toId, body }: { from: number; to: number; body?: string }) {
		const to = await this.userService.findById(toId, ['blockedList']);
		const from = await this.userService.findById(fromId, ['invitations', 'invitations.to', 'friendList']);

		if (this.isFriend(from, to)) {
			this.logger.log(`User ${from.id} is already friends with user ${to.id}`);
			throw new BadRequestException('You are already friends');
		}

		if (toId === fromId) {
			this.logger.log(`User ${from.id} cannot invite yourself`);
			throw new BadRequestException('You cannot invite yourself');
		}

		if (this.isInvited(from, to)) {
			this.logger.log(`User ${from.id} is already invited to user ${to.id}`);
			throw new BadRequestException('Already invited');
		}

		if (this.isBlocked(to, from)) {
			this.logger.log(`User ${from.id} has been blocked by user ${to.id}`);
			throw new BadRequestException('You have been blocked by this user');
		}

		//create pending invitation
		const invitation = this.invitationRepository.create({
			from: { id: fromId },
			to,
			type: InvitationType.FRIEND,
			body,
		});
		const savedInvitation = await this.invitationRepository.save(invitation);

		this.logger.log(`Invitation created: ${savedInvitation.id}`);

		//create notification and emit invitation.create to 'to' user
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

	@Transactional()
	async replyInvitation({ userId /*receiver */, invitationId, accepted }: { userId: number; invitationId: number; accepted: boolean }) {
		const invitation = await this.invitationRepository.findOne({
			where: {
				id: invitationId,
				to: { id: userId },
				status: InvitationStatus.PENDING,
			},
			relations: ['from', 'to', 'from.friendList', 'to.friendList', 'from.notifications'],
		});

		if (!invitation) {
			this.logger.log(`Invitation not found for user ${userId} and invitation ${invitationId}`);
			throw new BadRequestException('Invitation not found');
		}

		// update status
		if (accepted) {
			invitation.status = InvitationStatus.ACCEPTED;
			this.logger.log(`Invitation ${invitationId} accepted for user ${userId}`);

			await this.makeFriend(invitation.from, invitation.to);

			//create direct chat after accepted, emit chat to both user
			await this.chatService.createDirectChat(invitation.from, invitation.to);
		} else {
			invitation.status = InvitationStatus.REJECTED;
			this.logger.log(`Invitation ${invitationId} rejected for user ${userId}`);
		}

		//create notification and emit invitation to 'from' user
		await this.notificationService.createNotification(
			invitation.from,
			{
				type: NotificationType.INVITATION_REPLY,
				invitation,
			},
			(from) => from.settings.notification.friendRequestReply,
		);

		return this.invitationRepository.save(invitation);
	}

	@Transactional()
	async unfriend({ userId, friendId }: { userId: number; friendId: number }) {
		const user = await this.userService.findById(userId, true);
		const friend = await this.userService.findById(friendId, true);

		if (this.isFriend(user, friend)) {
			await this.userRepository.createQueryBuilder().relation(User, 'friendList').of(userId).remove(friendId);
			await this.userRepository.createQueryBuilder().relation(User, 'friendList').of(friendId).remove(userId);
			this.logger.log(`User ${userId} is now unfriends with user ${friendId}`);

			//emit friend.unfriend to friend
			const redis = this.redisService.getClient();
			const friendSocketId = await redis.get(`user:${friendId}:socket`);
			if (friendSocketId) {
				this.friendGateway.server.to(friendSocketId).emit('friend.delete', userId);
			}
		}

		// return await this.userService.findById(userId, true);
		return true;
	}

	async blockUser({ userId, blockedUserId }: { userId: number; blockedUserId: number }) {
		const user = await this.userService.findById(userId, true);
		const blockedUser = await this.userService.findById(blockedUserId);

		if (this.isBlocked(user, blockedUser)) {
			this.logger.log(`User ${userId} is already blocked by user ${blockedUserId}`);
			throw new BadRequestException('User already blocked');
		}

		user.blockedList.push(blockedUser);
		await this.userRepository.save(user);

		//emit block.create to blocked user
		const redis = this.redisService.getClient();
		const blockedUserIdSocketId = await redis.get(`user:${blockedUserId}:socket`);
		if (blockedUserIdSocketId) {
			this.friendGateway.server.to(blockedUserIdSocketId).emit('block.create', userId);
		}

		return user;
	}

	async unblockUser({ userId, blockedUserId }: { userId: number; blockedUserId: number }) {
		const user = await this.userService.findById(userId, true);
		const blockedUser = await this.userService.findById(blockedUserId);

		if (!this.isBlocked(user, blockedUser)) {
			this.logger.log(`User ${userId} is not blocked by user ${blockedUserId}`);
			throw new BadRequestException('User is not blocked');
		}

		user.blockedList = user.blockedList.filter((user) => user.id !== blockedUserId);
		await this.userRepository.save(user);

		//emit block.delete to blocked user
		const redis = this.redisService.getClient();
		const blockedUserIdSocketId = await redis.get(`user:${blockedUserId}:socket`);
		if (blockedUserIdSocketId) {
			this.friendGateway.server.to(blockedUserIdSocketId).emit('block.delete', userId);
		}

		this.logger.log(`User ${userId} is now unblocked ${blockedUserId}`);

		return user;
	}
}
