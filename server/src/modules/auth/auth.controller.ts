import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './auth.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.interface';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { User } from 'src/entities/user.entity';

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
	async signup(@Body() userData: SignupDto, @Res({ passthrough: true }) res: Response) {
		const user = await this.authService.signup(userData);

		const { access_token } = await this.authService.signin(user);

		res.cookie('access_token', access_token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { message: 'Signup successful' };
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	async signin(@Body() signinInfo: SigninDto, @Res({ passthrough: true }) res: Response) {
		const { access_token } = await this.authService.signin(signinInfo);

		res.cookie('access_token', access_token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { message: 'Signin successful' };
	}

	@Post('google-signin')
	@UseGuards(GoogleAuthGuard)
	async googleSignin(@GetUser() user: User, @Res({ passthrough: true }) res: Response) {
		const { access_token } = await this.authService.signin(user);

		res.cookie('access_token', access_token, {
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});

		return { message: 'Signin successful' };
	}

	@Post('signout')
	signout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('access_token');

		return { message: 'Signout successful' };
	}
}
