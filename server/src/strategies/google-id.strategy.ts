import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-strategy';
import { OAuth2Client } from 'google-auth-library';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class GoogleIdStrategy extends Strategy {
	name = 'google-id';

	private client: OAuth2Client;

	constructor(
		private readonly userService: UserService,
		private readonly userRepository: Repository<User>,
	) {
		super();
		this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
	}

	authenticate(req: Request<any, any, { idToken: string }>) {
		const idToken = req.body?.idToken;
		if (!idToken) {
			return this.fail('No ID token provided', 400);
		}

		this.client
			.verifyIdToken({
				idToken,
				audience: process.env.GOOGLE_CLIENT_ID,
			})
			.then(async (ticket) => {
				const payload = ticket.getPayload();

				if (!payload || !payload.email || !payload.name) {
					return this.fail('Invalid credentials', 400);
				}

				let user = await this.userService.findByEmail(payload.email);

				if (!user) {
					user = this.userRepository.create({
						email: payload.email,
						name: payload.name,
						avatar: payload?.picture,
					});
					await this.userRepository.save(user);
				}

				this.success(user);
			})
			.catch((err: Error) => {
				this.error(err);
			});
	}
}
