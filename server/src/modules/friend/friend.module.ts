import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from '../user/user.module';
import { Notification } from 'src/entities/notification.entity';
import { Invitation } from 'src/entities/invitation.entity';

@Module({
	controllers: [FriendController],
	providers: [FriendService],
	imports: [UserModule, TypeOrmModule.forFeature([Notification, Invitation])],
	exports: [TypeOrmModule, FriendService],
})
export class FriendModule {}
