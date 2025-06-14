import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Message } from './message.entity';
import { User } from './user.entity';

export enum ReactionEnum {
	LIKE = '👍',
	LOVE = '❤️',
	HAPPY = '😂',
	WOW = '😮',
	SAD = '😢',
	ANGRY = '😡',
	FIRE = '🔥',
	CLAP = '👏',
}

@Entity('message_reactions')
export class MessageReaction {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Message, (message) => message.reactions, { onDelete: 'CASCADE' })
	message: Message;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@Column({
		type: 'enum',
		enum: ReactionEnum,
	})
	emoji: ReactionEnum;

	@CreateDateColumn()
	createdAt: Date;
}
