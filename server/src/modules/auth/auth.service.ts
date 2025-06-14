import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
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
		const user = await this.userService.findByEmail(email, true);

		if (!user.password) {
			throw new UnauthorizedException("User doesn't have a password");
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid password');
		}

		return user;
	}

	async signup(userData: Partial<User>) {
		const isUserExists = await this.userService.findByEmail(userData.email!, true);
		if (isUserExists) {
			throw new BadRequestException('User already exists');
		}

		const hashedPassword = bcrypt.hashSync(userData.password!, 10);
		const user = this.userRepository.create({ ...userData, password: hashedPassword });
		return await this.userRepository.save(user);
	}

	async signin(userData: Partial<User>) {
		const user = await this.userService.findByEmail(userData.email!, true);
		const payload: JwtPayload = { email: user.email, sub: user.id };
		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}
}
