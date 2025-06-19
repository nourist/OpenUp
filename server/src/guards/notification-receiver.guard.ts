import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from 'src/types/jwt-payload.type';
import { NotificationService } from 'src/modules/notification/notification.service';

@Injectable()
export class IsNotificationReceiverGuard implements CanActivate {
	constructor(private readonly notificationService: NotificationService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const user = req.user as JwtPayload; // get from jwt
		const notificationId: number = +req.params.notificationId || (req.body as { notificationId: number }).notificationId; // get notificationId from params or body

		if (!notificationId) {
			throw new ForbiddenException('Notification ID is required');
		}

		const isReceiver = await this.notificationService.isNotificationReceiver(notificationId, user.sub);

		if (!isReceiver) {
			throw new ForbiddenException('You are not the receiver of the notification');
		}

		return true;
	}
}
