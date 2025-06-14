import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from '../user/user.module';
import { Invitation } from 'src/entities/invitation.entity';
import { NotificationModule } from '../notification/notification.module';
import { ChatModule } from '../chat/chat.module';

@Module({
	controllers: [FriendController],
	providers: [FriendService],
	imports: [UserModule, NotificationModule, ChatModule, TypeOrmModule.forFeature([Invitation])],
	exports: [TypeOrmModule, FriendService],
})
export class FriendModule {}
