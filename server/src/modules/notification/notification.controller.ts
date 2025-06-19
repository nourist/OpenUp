import { Controller, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';

import { NotificationService } from './notification.service';
import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { IsNotificationReceiverGuard } from 'src/guards/notification-receiver.guard';

@Controller('notification')
export class NotificationController {
	constructor(private readonly notificationService: NotificationService) {}

	@Patch(':notificationId/seen')
	@UseGuards(JwtAuthGuard, IsNotificationReceiverGuard)
	async seenNotification(@GetUser() user: JwtPayload, @Param('notificationId', ParseIntPipe) notificationId: number) {
		return {
			message: 'Notification seen',
			notification: instanceToPlain(await this.notificationService.seenNotification(notificationId)),
		};
	}
}
