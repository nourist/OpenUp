import { Timestamp } from 'firebase/firestore';

import { MessageType } from './message.type';

export interface Chat {
	id: string;
	participants: [string, string];
	lastMessage?: {
		id: string;
		content: string;
		senderId: string;
		type: MessageType;
		timestamp: Timestamp;
	};
	isMuted?: Record<string, boolean>;
	isPinned?: Record<string, boolean>;

	createdAt: Timestamp;
	totalMessages: number;
	unreadCount?: Record<string, number>;
}
