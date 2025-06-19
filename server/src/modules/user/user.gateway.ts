import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import * as cookie from 'cookie';

import { RedisService } from '../redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt-payload.type';

@WebSocketGateway({
	cors: {
		origin: process.env.CLIENT_URL || 'http://localhost:5173',
		credentials: true,
	},
})
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger: Logger = new Logger(UserGateway.name);

	constructor(
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
	) {}

	async handleConnection(client: Socket) {
		console.log(`Client connected: ${client.id}`);

		const headers = client.handshake.headers;
		const rawCookie = headers.cookie || '';
		const cookies = cookie.parse(rawCookie);
		const accessToken = cookies.access_token;

		if (!accessToken) {
			this.logger.error(`Client disconnected: ${client.id} because no access token provided`);
			client.disconnect(true);
			return;
		}

		try {
			const payload = await this.jwtService.verifyAsync<JwtPayload>(accessToken, {
				secret: process.env.JWT_SECRET,
			});

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			client.data.user = {
				sub: payload.sub,
				email: payload.email,
			};

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			this.logger.log('User authenticated:', client.data.user);

			const redis = this.redisService.getClient();
			await redis.set(`socket:${client.id}:online`, 'true');
			await redis.set(`socket:${client.id}:user`, JSON.stringify(payload.sub));
			await redis.set(`user:${payload.sub}:socket`, client.id);

			this.logger.log('Set user online status to true');
		} catch (err) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			this.logger.error(`JWT verify failed: ${err.message}`);
			return client.disconnect(true);
		}
	}

	async handleDisconnect(client: Socket) {
		console.log(`Client disconnected: ${client.id}`);

		const redis = this.redisService.getClient();
		await redis.del(`socket:${client.id}:online`);
		await redis.del(`socket:${client.id}:user`);

		this.logger.log('Set user online status to false');
	}
}
