import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { RecommendUserDto, SearchUserDto } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) { }
	
	@Get('recommend')
	@UseGuards(JwtAuthGuard)
	async getRecommendUser(@GetUser() user: JwtPayload, @Query() query: RecommendUserDto) {
		const users = await this.userService.getRecommendUser(user.sub, query);
		return {
			message: 'Get recommend user successfully',
			users: instanceToPlain(users),
		};
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	async searchUser(@Query() query: SearchUserDto) {
		return {
			message: 'Search user successfully',
			users: instanceToPlain(await this.userService.searchUserByEmail(query))
		};
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	async getUser(@Param('id', ParseIntPipe) id: number) {
		return {
			message: 'Get user successfully',
			user: instanceToPlain({
				...await this.userService.findById(id),
				online: await this.userService.getUserStatus(id)
			})
		};
	}
}
