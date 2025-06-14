import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Chat } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/chatParticipants.entity';
import { Message } from 'src/entities/message.entity';
import { MessageReaction } from 'src/entities/messageReaction.entity';
import { MessageAttachment } from 'src/entities/messageAttachment.entity';

@Module({
	controllers: [ChatController],
	providers: [ChatService],
	imports: [TypeOrmModule.forFeature([Chat, ChatParticipant, Message, MessageReaction, MessageAttachment])],
	exports: [TypeOrmModule, ChatService],
})
export class ChatModule {}
