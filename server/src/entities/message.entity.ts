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
import { MessageAttachment } from './messageAttachment.entity';
import { MessageReaction } from './messageReaction.entity';
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

	@OneToMany(() => MessageAttachment, (attachment) => attachment.message)
	attachments: MessageAttachment[];

	@OneToOne(() => Message, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn()
	replyTo?: Message;

	@ManyToMany(() => User)
	@JoinTable()
	mentionedUsers: User[];

	@OneToMany(() => MessageReaction, (reaction) => reaction.message)
	reactions: MessageReaction[];

	@ManyToMany(() => User)
	@JoinTable()
	seenBy: User[];

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@DeleteDateColumn()
	deletedAt: Date;
}
