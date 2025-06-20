import { Controller, Get, Param, ParseIntPipe, Query, UseGuards, Patch, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';

import { RecommendUserDto, SearchUserDto, UpdateUserSettingDto } from './user.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtPayload } from 'src/types/jwt-payload.type';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Patch('avatar')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(
		FileInterceptor('avatar', {
			fileFilter: (req, file, cb) => {
				if (file.mimetype.startsWith('image/')) {
					cb(null, true);
				} else {
					cb(new Error('Only image files are allowed'), false);
				}
			},
			storage: diskStorage({
				destination: (req, file, cb) => {
					const uploadPath = './uploads/avatars';
					if (!existsSync(uploadPath)) {
						mkdirSync(uploadPath, { recursive: true });
					}
					cb(null, uploadPath);
				},
				filename: (req, file, cb) => {
					const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
					cb(null, uniqueName);
				},
			}),
		}),
	)
	async uploadAvatar(@GetUser() user: JwtPayload, @UploadedFile() file: Express.Multer.File) {
		const avatarPath = `uploads/avatars/${file.filename}`;
		const updatedUser = await this.userService.updateUserAvatar(user.sub, avatarPath);
		return {
			message: 'Avatar uploaded successfully',
			user: instanceToPlain(updatedUser),
		};
	}

	@Patch('settings')
	@UseGuards(JwtAuthGuard)
	async updateUserSettings(@GetUser() user: JwtPayload, @Body() body: UpdateUserSettingDto) {
		const updatedUser = await this.userService.updateUserSettings(user.sub, body);
		return {
			message: 'Update user settings successfully',
			user: instanceToPlain(updatedUser),
		};
	}

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
			users: instanceToPlain(await this.userService.searchUserByEmail(query)),
		};
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	async getUser(@Param('id', ParseIntPipe) id: number) {
		return {
			message: 'Get user successfully',
			user: instanceToPlain({
				...(await this.userService.findById(id)),
				online: await this.userService.getUserStatus(id),
			}),
		};
	}
}
