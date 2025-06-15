import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ChangeNicknameDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	nickname: string;
}
