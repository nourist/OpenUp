import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { ChatModule } from '../chat/chat.module';
import { UserModule } from '../user/user.module';

@Module({
	controllers: [GroupController],
	providers: [GroupService],
	imports: [ChatModule, UserModule],
	exports: [GroupService],
})
export class GroupModule {}
