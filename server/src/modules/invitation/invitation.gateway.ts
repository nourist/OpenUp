import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class InvitationGateway {
	@WebSocketServer()
	server: Server;
}
