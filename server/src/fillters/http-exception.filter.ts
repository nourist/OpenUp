import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const exceptionResponse = exception.getResponse();

			if (typeof exceptionResponse === 'object') {
				response.status(status).json({
					...exceptionResponse,
					statusCode: status,
					timestamp: new Date().toISOString(),
					path: request.url,
				});
			} else {
				response.status(status).json({
					statusCode: status,
					message: exceptionResponse,
					error: exception.name,
					timestamp: new Date().toISOString(),
					path: request.url,
				});
			}
		} else {
			response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				message: 'Internal server error',
				error: 'Internal Server Error',
				timestamp: new Date().toISOString(),
				path: request.url,
			});
		}
	}
}
