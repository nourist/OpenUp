import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Notification } from './notification.entity';
import { Invitation } from './invitation.entity';

export interface UserSettings {
	preferLanguage: string;

	notification: {
		mention: boolean;
		reply: boolean;
		friend: boolean;
		group: boolean;
	};

	notificationSound: {
		message: boolean;
		mention: boolean;
		reply: boolean;
		friend: boolean;
		group: boolean;
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
	@JoinTable({
		name: 'user_blocked_users',
		joinColumn: {
			name: 'blocker_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'blocked_id',
			referencedColumnName: 'id',
		},
	})
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
				mention: true,
				reply: true,
				friend: true,
				group: true,
			},

			notificationSound: {
				message: true,
				mention: true,
				reply: true,
				friend: true,
				group: true,
			},
		},
	})
	settings: UserSettings;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
