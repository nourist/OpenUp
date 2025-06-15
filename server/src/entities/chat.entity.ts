import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Message } from './message.entity';
import { ChatParticipant } from './chatParticipants.entity';
import { Invitation } from './invitation.entity';

export enum ChatType {
	GROUP = 'group',
	DIRECT = 'direct',
}

@Entity('chats')
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		type: 'enum',
		enum: ChatType,
	})
	type: ChatType;

	@OneToMany(() => ChatParticipant, (participant) => participant.chat)
	participants: ChatParticipant[];

	@OneToMany(() => Message, (message) => message.chat)
	messages: Message[];

	@OneToOne(() => Message, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn()
	lastMessage?: Message;

	@Column({ default: false })
	allowInviteUUID: boolean;

	@Column({ nullable: true })
	inviteUUID?: string | null;

	@Column({ nullable: true })
	inviteUUIDExpiresAt?: Date | null;

	@Column({ nullable: true })
	avatar?: string;

	@Column({ nullable: true })
	name?: string;

	@OneToMany(() => Invitation, (invitation) => invitation.group)
	invitations: Invitation[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
