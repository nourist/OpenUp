import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from 'class-validator';

import { ReactionEnum } from 'src/entities/message-reaction.entity';

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

export class AddMessageAttachmentDto {
	@IsNumber()
	id: number;
}

export class EditMessageDto {
	@IsOptional()
	@IsString()
	content?: string;

	@IsOptional()
	@IsNumber()
	replyToId?: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => AddMessageAttachmentDto)
	attachments?: AddMessageAttachmentDto[];

	@IsOptional()
	@IsBoolean()
	removeReplyTo?: boolean;
}

export class AddReactionDto {
	@IsNotEmpty()
	@IsEnum(ReactionEnum)
	emoji: ReactionEnum;
}
