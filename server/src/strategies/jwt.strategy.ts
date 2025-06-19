import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from 'src/types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => (req?.cookies?.access_token ?? null) as string | null]),
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET!,
		});
	}

	validate(payload: JwtPayload) {
		return { sub: payload.sub, email: payload.email };
	}
}
