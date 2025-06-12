import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from 'src/modules/auth/auth.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<User> {
		try {
			const user = await this.authService.validateUser(email, password);

			return user;
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
			throw new UnauthorizedException('Login failed');
		}
	}
}
