import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../../entities/user.entity';
import { UserGateway } from './user.gateway';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
	controllers: [UserController],
	providers: [UserService, UserGateway],
	imports: [TypeOrmModule.forFeature([User]), RedisModule, JwtModule],
	exports: [TypeOrmModule, UserService],
})
export class UserModule {}
