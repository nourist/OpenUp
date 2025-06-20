import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

@Injectable()
export class SocketIoAdapter extends IoAdapter {
	createIOServer(port: number, options?: ServerOptions): any {
		const cors = {
			origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
			credentials: true,
		};
		return super.createIOServer(port, { ...options, cors });
	}
}
