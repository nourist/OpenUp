import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from './user.entity';
import { Chat } from './chat.entity';

export interface ChatParticipantSettings {
	muted: boolean;
	pinned: boolean;
}

@Entity('chat_participants')
export class ChatParticipant {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.chats, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Chat, (chat) => chat.participants, { onDelete: 'CASCADE' })
	chat: Chat;

	@Column({
		type: 'jsonb',
		default: {
			muted: false,
			pinned: false,
		},
	})
	settings: ChatParticipantSettings;

	@Column({ default: false })
	isOwner: boolean;

	@Column({ default: false })
	isAdmin: boolean;

	@Column({ default: false })
	isBanned: boolean;

	@Column({ default: true })
	isActive: boolean;

	@Column({ nullable: true, type: 'varchar', length: 255 })
	nickname?: string | null;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
