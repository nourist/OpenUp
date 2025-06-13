import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { User } from './user.entity';

export enum InvitationType {
	GROUP = 'group',
	FRIEND = 'friend',
}

export enum InvitationStatus {
	PENDING = 'pending',
	ACCEPTED = 'accepted',
	DECLINED = 'declined',
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

	@ManyToOne(() => User, (user) => user.invitations)
	from: User;

	@ManyToOne(() => User)
	to: User;

	@Column({ default: '' })
	body: string;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
