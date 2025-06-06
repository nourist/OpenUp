import { Timestamp } from 'firebase/firestore';

export interface Invitation {
	type: 'friend' | 'group';
	group?: string;
	from: string;
	to: string;
	status: 'pending' | 'accepted' | 'rejected';
	content?: string;
	createdAt: Timestamp;
}
