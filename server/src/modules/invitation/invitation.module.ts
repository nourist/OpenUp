import { Module } from '@nestjs/common';

import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { Invitation } from 'src/entities/invitation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from '../chat/chat.module';
import { RedisModule } from '../redis/redis.module';
import { NotificationModule } from '../notification/notification.module';
import { InvitationGateway } from './invitation.gateway';

@Module({
	controllers: [InvitationController],
	providers: [InvitationService, InvitationGateway],
	imports: [TypeOrmModule.forFeature([Invitation]), ChatModule, RedisModule, NotificationModule],
	exports: [TypeOrmModule, InvitationService],
})
export class InvitationModule {}
