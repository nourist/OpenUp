import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { Notification } from 'src/entities/notification.entity';
import { Invitation } from 'src/entities/invitation.entity';

@Module({
	controllers: [UserController],
	providers: [UserService],
	imports: [TypeOrmModule.forFeature([User, Notification, Invitation])],
	exports: [TypeOrmModule, UserService],
})
export class UserModule {}
