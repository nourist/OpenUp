import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findByEmail(email);
		if (!user) {
			return null;
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			return null;
		}

		return user;
	}

	async signup(userData: Partial<User>) {
		const hashedPassword = bcrypt.hashSync(userData.password!, 10);
		const user = this.userRepository.create({ ...userData, password: hashedPassword });
		return await this.userRepository.save(user);
	}

	login(userData: Partial<User>) {
		const payload: JwtPayload = { email: userData.email!, sub: userData.id! };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}
