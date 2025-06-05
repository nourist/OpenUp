import { MessageType } from './message.type';

export type GroupRole = 'owner' | 'admin' | 'member';

export interface GroupMember {
	userId: string;
	role: GroupRole;
	addedBy?: string; // userId
	isActive: boolean; // false if left/removed
	joinedAt: Date;
	leftAt?: Date;
}

export interface GroupSettings {
	allowInviteLink: boolean;
	inviteLink: string;
	inviteLinkExpiresAt: Date;

	onlyAdminsCanPost: boolean;
	allowMemberAddOthers: boolean;
	allowMemberChangeInfo: boolean;

	requireLinkApprovalToJoin: boolean;
}

export interface Group {
	id: string;

	// Basic info
	name: string;
	description?: string;
	avatar?: string;

	// Members
	members: GroupMember[];

	// Ownership
	ownerId: string;
	adminIds: string[];

	// Settings
	settings: GroupSettings;

	// Last message info
	lastMessage?: {
		id: string;
		content: string;
		senderId: string;
		senderName: string;
		type: MessageType;
		timestamp: Date;
	};

	// User-specific settings
	userSettings?: Record<
		string,
		{
			isMuted: boolean;
			isPinned: boolean;
			nickname?: string; // custom name for this group
		}
	>;

	// Timestamps
	createdAt: Date;

	// Stats
	totalMessages: number;
	unreadCount?: Record<string, number>; // userId -> unread count

	// Moderation
	bannedUsers?: string[]; // userIds
}
