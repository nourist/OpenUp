import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class InviteFriendDto {
	@IsNotEmpty()
	@IsNumber()
	to: number;

	@IsOptional()
	@IsString()
	body?: string;
}

export class CancelInvitationDto {
	@IsNotEmpty()
	@IsNumber()
	invitationId: number;
}

export class ReplyInvitationDto {
	@IsNotEmpty()
	@IsNumber()
	invitationId: number;

	@IsNotEmpty()
	@IsBoolean()
	accepted: boolean;
}

export class BlockUserDto {
	@IsNotEmpty()
	@IsNumber()
	blockedUserId: number;
}

export class UnblockUserDto {
	@IsNotEmpty()
	@IsNumber()
	blockedUserId: number;
}

export class UnfriendDto {
	@IsNotEmpty()
	@IsNumber()
	friendId: number;
}
