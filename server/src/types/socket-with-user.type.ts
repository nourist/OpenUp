import { Socket } from 'socket.io';

import { JwtPayload } from './jwt-payload.type';

export interface SocketWithUser extends Socket {
	data: {
		user: JwtPayload;
	};
}
