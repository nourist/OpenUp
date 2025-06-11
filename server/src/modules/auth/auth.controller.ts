import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './auth.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getProfile(@GetUser() user: JwtPayload) {
		return this.userService.findByEmail(user.email);
	}

	@Post('signup')
	signup(@Body() userData: SignupDto) {
		return this.authService.signup(userData);
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	signin(@Body() signinInfo: SigninDto, @Res({ passthrough: true }) res: Response) {
		const { access_token } = this.authService.login(signinInfo);

		res.cookie('access_token', access_token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { message: 'Login successful' };
	}
}
