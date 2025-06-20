import { IsBoolean, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Default } from 'src/decorators/set-default.decorator';
import { Type } from 'class-transformer';

export class SearchUserDto {
	@IsString()
	@IsOptional()
	@Default('')
	q: string;

	@IsNumber()
	@IsOptional()
	@Default(20)
	limit: number;
}

export class RecommendUserDto {
	@IsNumber()
	@IsOptional()
	@Default(20)
	limit: number;
}

class NotificationSettingsDto {
	@IsBoolean()
	@IsOptional()
	message: boolean;

	@IsBoolean()
	@IsOptional()
	reaction: boolean;

	@IsBoolean()
	@IsOptional()
	mention: boolean;

	@IsBoolean()
	@IsOptional()
	reply: boolean;

	@IsBoolean()
	@IsOptional()
	friendRequest: boolean;

	@IsBoolean()
	@IsOptional()
	groupInvitation: boolean;

	@IsBoolean()
	@IsOptional()
	friendRequestReply: boolean;

	@IsBoolean()
	@IsOptional()
	groupInvitationReply: boolean;
}

class NotificationSoundSettingsDto {
	@IsBoolean()
	@IsOptional()
	message: boolean;

	@IsBoolean()
	@IsOptional()
	reaction: boolean;

	@IsBoolean()
	@IsOptional()
	mention: boolean;

	@IsBoolean()
	@IsOptional()
	reply: boolean;

	@IsBoolean()
	@IsOptional()
	friendRequest: boolean;

	@IsBoolean()
	@IsOptional()
	groupInvitation: boolean;

	@IsBoolean()
	@IsOptional()
	friendRequestReply: boolean;

	@IsBoolean()
	@IsOptional()
	groupInvitationReply: boolean;
}

class UserSettingsDto {
	@IsString()
	@IsOptional()
	preferLanguage: string;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => NotificationSettingsDto)
	notification: NotificationSettingsDto;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => NotificationSoundSettingsDto)
	notificationSound: NotificationSoundSettingsDto;
}

export class UpdateUserSettingDto {
	@IsString()
	@IsOptional()
	name: string;

	@IsObject()
	@IsOptional()
	@ValidateNested()
	@Type(() => UserSettingsDto)
	settings: UserSettingsDto;
}

export class UpdateAvatarDto {
	@IsString()
	@IsOptional()
	avatar: string;
}
