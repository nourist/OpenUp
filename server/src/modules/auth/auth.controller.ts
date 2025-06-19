import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { instanceToPlain } from 'class-transformer';

import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './auth.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UserService } from '../user/user.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { User } from 'src/entities/user.entity';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { setAuthCookie, clearAuthCookie } from 'src/utils/authCookie';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	async getProfile(@GetUser() user: JwtPayload) {
		return {
			message: 'Get user profile successfully',
			user: instanceToPlain(await this.userService.findByEmail(user.email, true)),
		};
	}

	@Post('signup')
	async signup(@Body() userData: SignupDto, @Res({ passthrough: true }) res: Response) {
		const user = await this.authService.signup(userData);

		const { access_token, user: signedInUser } = await this.authService.signin(user);

		setAuthCookie(res, access_token);

		return { message: 'Signup successful', user: instanceToPlain(signedInUser) };
	}

	@Post('signin')
	@UseGuards(LocalAuthGuard)
	async signin(@Body() signinInfo: SigninDto, @Res({ passthrough: true }) res: Response) {
		const { access_token, user } = await this.authService.signin(signinInfo);

		setAuthCookie(res, access_token);

		return { message: 'Signin successful', user: instanceToPlain(user) };
	}

	@Post('google-signin')
	@UseGuards(GoogleAuthGuard)
	async googleSignin(@GetUser() userInfo: User, @Res({ passthrough: true }) res: Response) {
		const { access_token, user } = await this.authService.signin(userInfo);

		setAuthCookie(res, access_token);

		return { message: 'Signin successful', user: instanceToPlain(user) };
	}

	@Post('signout')
	signout(@Res({ passthrough: true }) res: Response) {
		clearAuthCookie(res);

		return { message: 'Signout successful' };
	}
}
