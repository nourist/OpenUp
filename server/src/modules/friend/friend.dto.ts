import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InviteFriendDto {
	@IsNotEmpty()
	@IsNumber()
	to: number;

	@IsOptional()
	@IsString()
	body?: string;
}
