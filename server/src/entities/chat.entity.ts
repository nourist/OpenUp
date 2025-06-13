import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

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

	@ManyToMany(() => User)
	@JoinTable()
	mutedBy: User[];

	@ManyToMany(() => User)
	@JoinTable()
	pinnedBy: User[];

	@ManyToMany(() => User, (user) => user.chats)
	@JoinTable()
	participants: User[];

	@OneToMany(() => Message, (message) => message.chat)
	messages: Message[];

	@OneToOne(() => Message, { nullable: true, onDelete: 'SET NULL' })
	@JoinColumn()
	lastMessage: Message;

	//timestamp
	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
