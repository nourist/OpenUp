import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from 'src/entities/message.entity';
import { MessageReaction } from 'src/entities/message-reaction.entity';
import { MessageAttachment } from 'src/entities/message-attachment.entity';

@Module({
	controllers: [MessageController],
	providers: [MessageService],
	imports: [TypeOrmModule.forFeature([Message, MessageReaction, MessageAttachment])],
	exports: [MessageService, TypeOrmModule],
})
export class MessageModule {}
