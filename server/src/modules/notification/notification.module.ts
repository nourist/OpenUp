import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from 'src/entities/notification.entity';
import { UserModule } from '../user/user.module';
import { RedisModule } from '../redis/redis.module';
import { NotificationGateway } from './notification.gateway';

@Module({
	controllers: [NotificationController],
	providers: [NotificationService, NotificationGateway],
	imports: [TypeOrmModule.forFeature([Notification]), UserModule, RedisModule],
	exports: [TypeOrmModule, NotificationService],
})
export class NotificationModule {}
