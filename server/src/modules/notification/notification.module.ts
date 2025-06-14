import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from 'src/entities/notification.entity';

@Module({
	controllers: [NotificationController],
	providers: [NotificationService],
	imports: [TypeOrmModule.forFeature([Notification])],
	exports: [TypeOrmModule, NotificationService],
})
export class NotificationModule {}
