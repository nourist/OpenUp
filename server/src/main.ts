import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new BadRequestException(
					validationErrors
						.map((error) => ({
							field: error.property,
							error: Object.values(error?.constraints ?? {})[0],
						}))
						.map((item) => ({ [item.field]: item.error })),
				);
			},
		}),
	);

	await app.listen(process.env.PORT ?? 8080);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
