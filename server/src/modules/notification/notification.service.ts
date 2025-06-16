import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

import { Notification, NotificationType } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Invitation } from 'src/entities/invitation.entity';

@Injectable()
export class NotificationService {
	private readonly logger: Logger = new Logger(NotificationService.name);

	constructor(
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
	) {}

	async createNotification(
		to: User,
		notification: {
			type: NotificationType;
			invitation?: Invitation;
		},
		checker: (to: User) => boolean,
	) {
		//check user notification setting before create notification
		if (checker(to)) {
			const newNotification = this.notificationRepository.create({
				user: to,
				type: notification.type,
				invitation: notification.invitation,
			});

			await this.notificationRepository.save(newNotification);
			this.logger.log(`Notification created for user ${to.id}`);
		}
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
