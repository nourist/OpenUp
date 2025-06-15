import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/chat-participants.entity';
import { Message } from 'src/entities/message.entity';
import { MessageReaction } from 'src/entities/message-reaction.entity';
import { MessageAttachment } from 'src/entities/message-attachment.entity';
import { UserModule } from '../user/user.module';

@Module({
	controllers: [ChatController],
	providers: [ChatService],
	imports: [TypeOrmModule.forFeature([Chat, ChatParticipant, Message, MessageReaction, MessageAttachment]), UserModule],
	exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
