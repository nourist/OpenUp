import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { FriendModule } from '../friend/friend.module';
import { NotificationModule } from '../notification/notification.module';
import { InvitationModule } from '../invitation/invitation.module';

@Module({
	controllers: [GroupController],
	providers: [GroupService],
	imports: [ChatModule, UserModule, FriendModule, NotificationModule, InvitationModule],
	exports: [GroupService],
})
export class GroupModule {}
