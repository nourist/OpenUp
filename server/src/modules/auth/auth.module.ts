import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UserModule } from '../user/user.module';

@Module({
	controllers: [AuthController],
	providers: [AuthService, LocalStrategy, JwtStrategy],
	imports: [
		UserModule,
		PassportModule,
		ConfigModule.forRoot(),
		JwtModule.register({
			secret: process.env.JWT_SECRET!,
			signOptions: {
				expiresIn: '7d',
			},
		}),
	],
})
export class AuthModule {}
