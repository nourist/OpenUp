import { IsOptional, IsString } from 'class-validator';

export class InviteFriendDto {
	@IsOptional()
	@IsString()
	body?: string;
}
