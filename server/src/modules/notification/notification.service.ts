import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
