import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Message } from './message.entity';

export enum AttachmentEnum {
	IMAGE = 'image',
	VIDEO = 'video',
	AUDIO = 'audio',
	GIF = 'gif',
	FILE = 'file',
}

@Entity('message_attachments')
export class MessageAttachment {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Message, (message) => message.attachments, { onDelete: 'CASCADE' })
	message: Message;

	@Column({
		type: 'enum',
		enum: AttachmentEnum,
	})
	type: AttachmentEnum;

	@Column({ nullable: true, type: 'varchar', length: 255 })
	fileName: string | null;

	@Column({ nullable: true, type: 'int' })
	fileSize: number | null;

	@Column({ nullable: true, type: 'varchar', length: 255 })
	fileType: string | null;

	@Column({ nullable: true, type: 'text' })
	fileURL: string | null;
}
