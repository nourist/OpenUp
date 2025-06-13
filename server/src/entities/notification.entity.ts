import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';

import { User } from './user.entity';
import { Invitation } from './invitation.entity';

export enum NotificationType {
	MENTION = 'mention',
	REPLY = 'reply',
	INVITATION = 'invitation',
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

	@OneToOne(() => Invitation, { nullable: true })
	@JoinColumn()
	invitation?: Invitation;

	@ManyToOne(() => User, (user) => user.notifications)
	user: User;

	@Column({ default: false })
	seen: boolean;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
