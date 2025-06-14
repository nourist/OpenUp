import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Message } from './message.entity';
import { ChatParticipant } from './chatParticipants.entity';

export enum ChatType {
	GROUP = 'group',
	DIRECT = 'direct',
}

export interface ChatSettings {
	allowInviteLink: boolean;
	inviteLink: string;
	inviteLinkExpiresAt: Date;

	onlyAdminsCanPost: boolean;
	allowMemberAddOthers: boolean;
	allowMemberChangeInfo: boolean;
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
	lastMessage: Message;

	@Column({ type: 'jsonb', nullable: true })
	settings?: ChatSettings;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
