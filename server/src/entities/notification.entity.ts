import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { User } from './user.entity';
import { Invitation } from './invitation.entity';

export enum NotificationType {
	MENTION = 'mention',
	REPLY = 'reply',
	INVITATION = 'invitation',
	INVITATION_REPLY = 'invitation_reply',
}

@Entity('notifications')
export class Notification {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: NotificationType,
	})
	type: NotificationType;

	@OneToOne(() => Invitation, { nullable: true, onDelete: 'CASCADE' })
	@JoinColumn()
	invitation?: Invitation;

	@ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
	user: User;

	@Column({ default: false })
	seen: boolean;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
