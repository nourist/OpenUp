import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { Invitation } from './invitation.entity';
import { Message } from './message.entity';
import { MessageReaction } from './message-reaction.entity';

export enum NotificationType {
	MENTION = 'mention',
	REPLY = 'reply',
	INVITATION = 'invitation',
	INVITATION_REPLY = 'invitation_reply',
	REACTION = 'reaction',
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

	@ManyToOne(() => Invitation, { nullable: true, onDelete: 'CASCADE' })
	invitation?: Invitation | null;

	@ManyToOne(() => Message, { nullable: true, onDelete: 'CASCADE' })
	message?: Message | null;

	@ManyToOne(() => MessageReaction, { nullable: true, onDelete: 'CASCADE' })
	reaction?: MessageReaction | null;

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
