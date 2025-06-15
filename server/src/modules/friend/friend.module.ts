import { Module } from '@nestjs/common';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notification/notification.module';
import { ChatModule } from '../chat/chat.module';
import { InvitationModule } from '../invitation/invitation.module';

@Module({
	controllers: [FriendController],
	providers: [FriendService],
	imports: [UserModule, NotificationModule, ChatModule, InvitationModule],
	exports: [FriendService],
})
export class FriendModule {}
