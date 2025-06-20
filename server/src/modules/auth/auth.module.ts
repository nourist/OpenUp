import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { GoogleIdStrategy } from 'src/strategies/google-id.strategy';
import { User } from 'src/entities/user.entity';
import { GoogleService } from '../google/google.service';

@Module({
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy, GoogleIdStrategy, GoogleService],
	imports: [
		UserModule,
		PassportModule,
		TypeOrmModule.forFeature([User]),
		JwtModule.register({
			secret: process.env.JWT_SECRET!,
			signOptions: {
				expiresIn: '7d',
			},
		}),
	],
})
export class AuthModule {}
