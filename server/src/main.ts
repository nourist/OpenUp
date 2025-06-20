import 'dotenv/config';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AllExceptionsFilter } from './fillters/http-exception.filter';
import { AppModule } from './app.module';
import { SocketIoAdapter } from './adapters/socket-io.adapter';

async function bootstrap() {
	initializeTransactionalContext();

	const app = await NestFactory.create(AppModule, {
		logger: ['error', 'warn', 'log', 'verbose', 'debug'],
	});

	app.enableCors({
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
		credentials: true, // nếu client gửi cookie
	});
	app.use(cookieParser());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
			exceptionFactory: (validationErrors: ValidationError[] = []) => {
				return new UnprocessableEntityException({
					statusCode: 422,
					error: 'Unprocessable Entity',
					message: 'Validation failed',
					fieldErrors: validationErrors.reduce(
						(acc, error) => ({
							...acc,
							[error.property]: Object.values(error?.constraints ?? {}).reduce((acc, cur) => cur, ''),
						}),
						{},
					),
				});
			},
		}),
	);
	app.useWebSocketAdapter(new SocketIoAdapter(app));
	app.useGlobalFilters(new AllExceptionsFilter());

	await app.listen(process.env.PORT ?? 8080);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
