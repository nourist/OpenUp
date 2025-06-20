import { IsOptional, IsString, IsNumber } from "class-validator";
import { Default } from "src/decorators/set-default.decorator";

export class SearchUserDto{
	@IsString()
	@IsOptional()
	@Default('')
	q: string;

	@IsNumber()
	@IsOptional()
	@Default(20)
	limit: number;
}

export class RecommendUserDto{
	@IsNumber()
	@IsOptional()
	@Default(20)
	limit: number;
}

