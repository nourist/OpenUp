import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/chat-participants.entity';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { NotificationModule } from '../notification/notification.module';
import { RedisModule } from '../redis/redis.module';

@Module({
	controllers: [ChatController],
	providers: [ChatService],
	imports: [TypeOrmModule.forFeature([Chat, ChatParticipant]), UserModule, MessageModule, NotificationModule, RedisModule],
	exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
