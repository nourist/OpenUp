import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from 'src/types/jwt-payload.type';
import { SocketWithUser } from 'src/types/socket-with-user.type';
import { RedisService } from '../redis/redis.service';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@WebSocketGateway()
export class UserGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger: Logger = new Logger(UserGateway.name);

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly redisService: RedisService,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	emitUserOnlineStatus(user: User, online: boolean) {
		if (user.chats.length == 0) return;
		this.server.to(user.chats.map((chat) => chat.chat.id.toString())).emit('user.status.update', { userId: user.id, online });
	}

	async handleConnection(client: SocketWithUser) {
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

			client.data.user = {
				sub: payload.sub,
				email: payload.email,
			};

			this.logger.log('User authenticated:', client.data.user);

			const redis = this.redisService.getClient();
			await redis.set(`socket:${client.id}:online`, 'true');
			await redis.set(`socket:${client.id}:user`, payload.sub);
			await redis.set(`user:${payload.sub}:socket`, client.id);

			const user = await this.userService.findById(payload.sub, ['chats', 'chats.chat', 'friendList']);

			await client.join(user.chats.map((item) => item.chat.id.toString()));

			this.emitUserOnlineStatus(user, true);

			this.logger.log('Set user online status to true');
		} catch (err) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			this.logger.error(`JWT verify failed: ${err.message}`);
			return client.disconnect(true);
		}
	}

	async handleDisconnect(client: SocketWithUser) {
		console.log(`Client disconnected: ${client.id}`);

		const redis = this.redisService.getClient();

		const user = await this.userService.findById(client.data.user.sub, ['chats', 'chats.chat', 'friendList']);
		this.emitUserOnlineStatus(user, false);

		await redis.del(`socket:${client.id}:online`);
		await redis.del(`socket:${client.id}:user`);

		this.logger.log('Set user online status to false');
	}
}
