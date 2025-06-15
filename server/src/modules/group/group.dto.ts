import { IsString, IsOptional, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGroupDto {
	@IsOptional()
	@IsString()
	@MaxLength(255)
	name?: string;

	@IsOptional()
	@IsString()
	avatar?: string;
}

export class ChangeGroupInfoDto {
	@IsOptional()
	@IsString()
	@MaxLength(255)
	name?: string;

	@IsOptional()
	@IsString()
	avatar?: string;
}

export class InviteToGroupDto {
	@IsNotEmpty()
	@IsNumber()
	to: number;

	@IsOptional()
	@IsString()
	body?: string;
}
