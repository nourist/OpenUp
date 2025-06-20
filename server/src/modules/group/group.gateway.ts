import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class GroupGateway {
	@WebSocketServer()
	server: Server;
}
