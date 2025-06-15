import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { User } from '../../entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload } from 'src/types/jwt-payload.interface';

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);

	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
	) {}

	async validateUser(email: string, password: string) {
		const user = await this.userService.findByEmail(email, true);

		if (!user.password) {
			this.logger.log(`User ${user.id} doesn't have a password`);
			throw new UnauthorizedException("User doesn't have a password");
		}

		const isPasswordValid = bcrypt.compareSync(password, user.password);
		if (!isPasswordValid) {
			this.logger.log(`Invalid password for user ${user.id}`);
			throw new UnauthorizedException('Invalid password');
		}

		return user;
	}

	async signup(userData: Partial<User>) {
		const isUserExists = await this.userService.findByEmail(userData.email!, true);
		if (isUserExists) {
			this.logger.log(`User ${userData.email} already exists`);
			throw new BadRequestException('User already exists');
		}

		const hashedPassword = bcrypt.hashSync(userData.password!, 10);
		const user = this.userRepository.create({ ...userData, password: hashedPassword });

		this.logger.log(`User ${user.id} created with email ${user.email}`);
		return await this.userRepository.save(user);
	}

	async signin(userData: Partial<User>) {
		const user = await this.userService.findByEmail(userData.email!, true);
		const payload: JwtPayload = { email: user.email, sub: user.id };
		this.logger.log(`User ${user.id} signed in with email ${user.email}`);
		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}
}
