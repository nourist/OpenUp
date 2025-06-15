import { IsOptional, IsString, MaxLength } from 'class-validator';

export class InviteFriendDto {
	@IsOptional()
	@IsString()
	@MaxLength(500)
	body?: string;
}
