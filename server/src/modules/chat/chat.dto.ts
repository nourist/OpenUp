import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class ChangeNicknameDto {
	@IsNotEmpty()
	@IsNumber()
	userId: number;

	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	nickname: string;
}

export class GetMessagesDto {
	@IsOptional()
	@IsNumber()
	@Min(1)
	@Max(100)
	limit?: number;

	@IsOptional()
	@IsDate()
	before?: Date;
}

export class AddMessageDto {
	@IsOptional()
	@IsString()
	content?: string;

	@IsOptional()
	@IsNumber()
	replyToId?: number;
}
