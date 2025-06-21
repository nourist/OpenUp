import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ChatType } from 'src/entities/chat.entity';
import { Invitation } from 'src/entities/invitation.entity';
import { InvitationStatus } from 'src/entities/invitation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatService } from '../chat/chat.service';
import { RedisService } from '../redis/redis.service';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class InvitationService {
	private readonly logger: Logger = new Logger(InvitationService.name);

	@WebSocketServer()
	server: Server;

	constructor(
		@InjectRepository(Invitation)
		private readonly invitationRepository: Repository<Invitation>,
		@InjectRepository(Notification)
		private readonly notificationRepository: Repository<Notification>,
		private readonly chatService: ChatService,
		private readonly redisService: RedisService,
	) {}

	async cancel({ chatId, invitationId, userId }: { chatId?: number; invitationId: number; userId: number }) {
		if (chatId) {
			await this.chatService.findById(chatId, true, ChatType.GROUP); //check if group exists, throw error if not
		}

		const invitation = await this.invitationRepository.findOne({
			//check if invitation exists and is pending and from user
			where: { id: invitationId, ...(chatId ? { group: { id: chatId } } : {}), status: InvitationStatus.PENDING, from: { id: userId } },
			relations: ['to'],
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

		const redis = this.redisService.getClient();
		const toSocketId = await redis.get(`user:${invitation.to.id}:socket`);

		const savedInvitation = await this.invitationRepository.save(invitation);

		if (chatId) {
			this.logger.log(`Invitation ${invitationId} canceled for group ${chatId}`);

			this.server.to(chatId.toString()).emit('chat.update', await this.chatService.findById(chatId, true, ChatType.GROUP));
		} else {
			this.logger.log(`Invitation ${invitationId} canceled for friend`);
		}

		if (toSocketId) {
			this.server
				.to(toSocketId)
				.emit(
					'notification.update',
					await this.notificationRepository.findOne({ where: { invitation: { id: invitationId } }, relations: ['invitation', 'invitation.from'] }),
				);
		}

		return savedInvitation;
	}
}
