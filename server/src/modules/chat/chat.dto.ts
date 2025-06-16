import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangeNicknameDto {
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
	@Transform(({ value }: { value: string }) => parseInt(value))
	limit?: number;

	@IsOptional()
	@IsDate()
	@Transform(({ value }: { value: string }) => new Date(value))
	before?: Date;
}
