import { BadRequestException } from '@nestjs/common';
import { AttachmentEnum } from 'src/entities/message-attachment.entity';

export const documentMineTypes = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'text/plain',
	'text/csv',
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/zip',
	'application/vnd.rar',
	'application/x-7z-compressed',
];

export const fileFilter = (req: Request, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
	if (file.mimetype.startsWith('image') || file.mimetype.startsWith('video') || file.mimetype.startsWith('audio') || documentMineTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new BadRequestException('That type of file is not allowed'), false);
	}
};

export const getAttachmentType = (file: Express.Multer.File) => {
	if (file.mimetype == 'image/gif') {
		return AttachmentEnum.GIF;
	} else if (file.mimetype.startsWith('image')) {
		return AttachmentEnum.IMAGE;
	} else if (file.mimetype.startsWith('video')) {
		return AttachmentEnum.VIDEO;
	} else if (file.mimetype.startsWith('audio')) {
		return AttachmentEnum.AUDIO;
	}
	return AttachmentEnum.FILE;
};
