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

	@Column({ nullable: true })
	fileName: string;

	@Column({ nullable: true })
	fileSize: number;

	@Column({ nullable: true })
	fileType: string;

	@Column({ nullable: true })
	fileURL: string;
}
