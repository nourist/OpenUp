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

@Entity('messages')
export class Message {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	sender: User;

	@Column({ default: '' })
	content: string;

	@OneToMany(() => MessageAttachment, (attachment) => attachment.message)
	attachments: MessageAttachment[];

	@OneToOne(() => Message, { nullable: true, onDelete: 'CASCADE' })
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
