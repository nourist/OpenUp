import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Notification } from './notification.entity';
import { Invitation } from './invitation.entity';
import { ChatParticipant } from './chatParticipants.entity';

export interface UserSettings {
	preferLanguage: string;

	notification: {
		message: boolean;
		reaction: boolean;
		mention: boolean;
		reply: boolean;
		friendRequest: boolean;
		groupInvitation: boolean;
		friendRequestReply: boolean;
		groupInvitationReply: boolean;
	};

	notificationSound: {
		message: boolean;
		reaction: boolean;
		mention: boolean;
		reply: boolean;
		friendRequest: boolean;
		groupInvitation: boolean;
		friendRequestReply: boolean;
		groupInvitationReply: boolean;
	};
}

@Entity('users')
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Exclude()
	@Column({ nullable: true })
	password?: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	avatar?: string;

	@ManyToMany(() => User, (user) => user.friendList)
	@JoinTable()
	friendList: User[];

	@ManyToMany(() => User, (user) => user.blockedBy)
	@JoinTable()
	blockedList: User[];

	@ManyToMany(() => User, (user) => user.blockedList)
	blockedBy: User[];

	@OneToMany(() => Notification, (notification) => notification.user)
	notifications: Notification[];

	@OneToMany(() => Invitation, (invitation) => invitation.from)
	invitations: Invitation[];

	@Column({
		type: 'jsonb',
		default: {
			preferLanguage: 'en',

			notification: {
				message: true,
				reaction: true,
				mention: true,
				reply: true,
				friendRequest: true,
				groupInvitation: true,
				friendRequestReply: true,
				groupInvitationReply: true,
			},

			notificationSound: {
				message: true,
				reaction: true,
				mention: true,
				reply: true,
				friendRequest: true,
				groupInvitation: true,
				friendRequestReply: true,
				groupInvitationReply: true,
			},
		},
	})
	settings: UserSettings;

	@OneToMany(() => ChatParticipant, (participant) => participant.user)
	chats: ChatParticipant[];

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
