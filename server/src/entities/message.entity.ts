import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';
import { MessageAttachment } from './message-attachment.entity';
import { MessageReaction } from './message-reaction.entity';
import { Chat } from './chat.entity';

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, { onDelete: 'SET NULL' })
	sender: User;

	@ManyToOne(() => Chat, (chat) => chat.messages, { onDelete: 'SET NULL' })
	chat: Chat;

	@Column({ default: '' })
	content: string;

	@OneToMany(() => MessageAttachment, (attachment) => attachment.message, { cascade: true })
	attachments: MessageAttachment[];

	@OneToOne(() => Message, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn()
	replyTo?: Message | null;

	@ManyToMany(() => User)
	@JoinTable()
	mentionedUsers: User[];

	@OneToMany(() => MessageReaction, (reaction) => reaction.message, { cascade: true })
	reactions: MessageReaction[];

	@ManyToMany(() => User)
	@JoinTable()
	seenBy: User[];

	@Column({ default: false })
	isEdited: boolean;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;
}
