import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ChatType } from 'src/entities/chat.entity';
import { Invitation } from 'src/entities/invitation.entity';
import { InvitationStatus } from 'src/entities/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class InvitationService {
	private readonly logger: Logger = new Logger(InvitationService.name);

	constructor(
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		private readonly chatService: ChatService,
	) {}

	async cancel({ chatId, invitationId, userId }: { chatId?: number; invitationId: number; userId: number }) {
		if (chatId) {
			await this.chatService.findById(chatId, true, ChatType.GROUP); //check if group exists, throw error if not
		}

		const invitation = await this.invitationRepository.findOne({
			//check if invitation exists and is pending and from user
			where: { id: invitationId, ...(chatId ? { group: { id: chatId } } : {}), status: InvitationStatus.PENDING, from: { id: userId } },
		});

		if (!invitation) {
			if (chatId) {
				this.logger.log(`Invitation ${invitationId} not found for group ${chatId}`);
			} else {
				this.logger.log(`Invitation ${invitationId} not found for friend`);
			}
			throw new BadRequestException('Invitation not found');
		}

		invitation.status = InvitationStatus.CANCELED;

		if (chatId) {
			this.logger.log(`Invitation ${invitationId} canceled for group ${chatId}`);
		} else {
			this.logger.log(`Invitation ${invitationId} canceled for friend`);
		}

		return this.invitationRepository.save(invitation);
	}
}
