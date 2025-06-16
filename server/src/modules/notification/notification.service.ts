import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

import { Notification, NotificationType } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Invitation } from 'src/entities/invitation.entity';
import { Message } from 'src/entities/message.entity';
import { UserService } from '../user/user.service';

type NotificationRelation = 'user' | 'invitation';

const getNotificationRelations = (relations: boolean | NotificationRelation[]): NotificationRelation[] => {
	if (typeof relations === 'boolean') {
		return relations ? ['user', 'invitation'] : [];
	}
	return relations;
};

@Injectable()
export class NotificationService {
	private readonly logger: Logger = new Logger(NotificationService.name);

	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
		private readonly userService: UserService,
	) {}

	async findById(notificationId: number) {
		const notification = await this.notificationRepository.findOne({ where: { id: notificationId }, relations: getNotificationRelations(true) });
		if (!notification) {
			throw new BadRequestException('Notification not found');
		}
		return notification;
	}

	async isNotificationReceiver(notificationId: number, userId: number) {
		const notification = await this.findById(notificationId);
		return notification.user.id === userId;
	}

	async createNotification(
		to: User,
		notification: {
			type: NotificationType;
			invitation?: Invitation;
			message?: Message;
		},
		checker: (to: User) => boolean,
	) {
		//check user notification setting before create notification
		if (checker(to)) {
			const newNotification = this.notificationRepository.create({
				user: to,
				type: notification.type,
				invitation: notification.invitation,
				message: notification.message,
			});

			await this.notificationRepository.save(newNotification);
			this.logger.log(`Notification created for user ${to.id}`);
		}
	}

	async createNotificationForMentionedUsers(users: { id: number }[], message: Message) {
		await Promise.all(
			users.map(async ({ id }) => {
				const user = await this.userService.findById(id);
				return this.createNotification(
					user,
					{
						type: NotificationType.MENTION,
						message: message,
					},
					(user) => user.settings.notification.mention,
				);
			}),
		);
	}

	async seenNotification(notificationId: number) {
		const notification = await this.findById(notificationId);
		notification.seen = true;
		return this.notificationRepository.save(notification);
	}

	@Cron('0 0 * * *')
	async deleteOldNotifications() {
		//task schedule to delete old notifications
		this.logger.log('Deleting old notifications');

		const notifications = await this.notificationRepository.find({
			where: {
				createdAt: LessThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
			},
		});
		this.logger.log(`Found ${notifications.length} old notifications`);
		await this.notificationRepository.remove(notifications);

		this.logger.log('Old notifications deleted');
	}
}
