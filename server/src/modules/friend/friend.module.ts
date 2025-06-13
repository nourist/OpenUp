import { Module } from '@nestjs/common';

import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UserModule } from '../user/user.module';

@Module({
	controllers: [FriendController],
	providers: [FriendService],
	imports: [UserModule],
})
export class FriendModule {}
