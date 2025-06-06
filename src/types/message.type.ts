import { Timestamp } from 'firebase/firestore';

export type MessageType = 'text' | 'image' | 'file' | 'video' | 'gif';

export type MessageStatus = 'sending' | 'sent' | 'failed';

export interface Message {
	id: string;
	chatId: string;
	senderId: string;

	type: MessageType;
	content?: string;
	fileName?: string;
	fileSize?: number;
	fileType?: string;
	fileURL?: string;

	replyTo?: string;
	mentions?: string[];
	emoji?: string[];
	isForwarded?: boolean;
	forwardedFrom?: string;
	status: MessageStatus;
	readBy?: Record<string, Timestamp>;
	isEdited: boolean;

	createdAt: Timestamp;

	isDeleted: boolean;
	deletedAt?: Timestamp;
	deletedBy?: string;
}
