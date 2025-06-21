import { Module } from '@nestjs/common';

import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';
import { FriendModule } from '../friend/friend.module';
import { NotificationModule } from '../notification/notification.module';
import { InvitationModule } from '../invitation/invitation.module';
import { RedisModule } from '../redis/redis.module';
import { GroupGateway } from './group.gateway';

@Module({
	controllers: [GroupController],
	providers: [GroupService, GroupGateway],
	imports: [ChatModule, UserModule, FriendModule, NotificationModule, InvitationModule, RedisModule],
	exports: [GroupService],
})
export class GroupModule {}
