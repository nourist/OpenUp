import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: RedisClientType;

	constructor() {
		this.client = createClient({
			password: process.env.REDIS_PASSWORD,
			socket: {
				host: process.env.REDIS_HOST ?? 'localhost',
				port: Number(process.env.REDIS_PORT) || 6379,
			},
		});

		this.client.on('error', (err) => console.error('Redis Client Error', err));
	}

	async onModuleInit() {
		await this.client.connect();
	}

	async onModuleDestroy() {
		await this.client.quit();
	}

	getClient(): RedisClientType {
		return this.client;
	}
}
