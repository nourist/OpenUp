import { Module } from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { InvitationController } from './invitation.controller';
import { Invitation } from 'src/entities/invitation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from '../chat/chat.module';

@Module({
	controllers: [InvitationController],
	providers: [InvitationService],
	imports: [TypeOrmModule.forFeature([Invitation]), ChatModule],
	exports: [TypeOrmModule, InvitationService],
})
export class InvitationModule {}
