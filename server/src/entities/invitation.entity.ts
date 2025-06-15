import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';
import { Chat } from './chat.entity';

export enum InvitationType {
	GROUP = 'group',
	FRIEND = 'friend',
}

export enum InvitationStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	REJECTED = 'rejected',
	CANCELED = 'canceled',
}

@Entity('invitations')
export class Invitation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: InvitationType,
	})
	type: InvitationType;

	@Column({
		type: 'enum',
		enum: InvitationStatus,
		default: InvitationStatus.PENDING,
	})
	status: InvitationStatus;

	@ManyToOne(() => User, (user) => user.invitations, { onDelete: 'CASCADE' })
	from: User;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	to: User;

	@ManyToOne(() => Chat, (chat) => chat.invitations, { onDelete: 'CASCADE', nullable: true })
	group?: Chat | null;

	@Column({ default: '' })
	body: string;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
