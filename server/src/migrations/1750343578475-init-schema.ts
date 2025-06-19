import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1750343578475 implements MigrationInterface {
	name = 'InitSchema1750343578475';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "message_attachments" ("id" SERIAL NOT NULL, "type" "public"."message_attachments_type_enum" NOT NULL, "fileName" character varying(255) NOT NULL, "fileSize" integer NOT NULL, "fileType" character varying(255) NOT NULL, "messageId" integer, CONSTRAINT "PK_e5085d973567c61e9306f10f95b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "message_reactions" ("id" SERIAL NOT NULL, "emoji" "public"."message_reactions_emoji_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "messageId" integer, "userId" integer, CONSTRAINT "PK_654a9f0059ff93a8f156be66a5b" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "messages" ("id" SERIAL NOT NULL, "content" character varying NOT NULL DEFAULT '', "isEdited" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "senderId" integer, "chatId" integer, "replyToId" integer, CONSTRAINT "REL_f550135b17eaf7c5452ae5fd4a" UNIQUE ("replyToId"), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "chat_participants" ("id" SERIAL NOT NULL, "settings" jsonb NOT NULL DEFAULT '{"muted":false,"pinned":false}', "isOwner" boolean NOT NULL DEFAULT false, "isAdmin" boolean NOT NULL DEFAULT false, "isBanned" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "nickname" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "chatId" integer, CONSTRAINT "PK_ebf68c52a2b4dceb777672b782d" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "chats" ("id" SERIAL NOT NULL, "type" "public"."chats_type_enum" NOT NULL, "allowInviteUUID" boolean NOT NULL DEFAULT false, "inviteUUID" text, "inviteUUIDExpiresAt" TIMESTAMP WITH TIME ZONE, "avatar" text, "name" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "lastMessageId" integer, CONSTRAINT "REL_5768a56bdd855c5b78ce66c9a3" UNIQUE ("lastMessageId"), CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "invitations" ("id" SERIAL NOT NULL, "type" "public"."invitations_type_enum" NOT NULL, "status" "public"."invitations_status_enum" NOT NULL DEFAULT 'pending', "body" character varying NOT NULL DEFAULT '', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "fromId" integer, "toId" integer, "groupId" integer, CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "type" "public"."notifications_type_enum" NOT NULL, "seen" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invitationId" integer, "messageId" integer, "reactionId" integer, "userId" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" text, "name" character varying NOT NULL, "avatar" text, "settings" jsonb NOT NULL DEFAULT '{"preferLanguage":"en","notification":{"message":true,"reaction":true,"mention":true,"reply":true,"friendRequest":true,"groupInvitation":true,"friendRequestReply":true,"groupInvitationReply":true},"notificationSound":{"message":true,"reaction":true,"mention":true,"reply":true,"friendRequest":true,"groupInvitation":true,"friendRequestReply":true,"groupInvitationReply":true}}', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`CREATE TABLE "messages_mentioned_users_users" ("messagesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_3a1f5c86a575fe56771e3847963" PRIMARY KEY ("messagesId", "usersId"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_2f0072d33b2bcc092da47308a7" ON "messages_mentioned_users_users" ("messagesId") `);
		await queryRunner.query(`CREATE INDEX "IDX_5686b89f52f9056809ea82e5ec" ON "messages_mentioned_users_users" ("usersId") `);
		await queryRunner.query(
			`CREATE TABLE "messages_seen_by_users" ("messagesId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_de24f575e4b10e2f3ad2dce3235" PRIMARY KEY ("messagesId", "usersId"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_5218d9c5fd3bc21e391472653b" ON "messages_seen_by_users" ("messagesId") `);
		await queryRunner.query(`CREATE INDEX "IDX_3b24ca739617132adabb681ee7" ON "messages_seen_by_users" ("usersId") `);
		await queryRunner.query(
			`CREATE TABLE "users_friend_list_users" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_3af9f4a05f5ec8861e04a6f97df" PRIMARY KEY ("usersId_1", "usersId_2"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_16b547f39347f28c17f4f88d03" ON "users_friend_list_users" ("usersId_1") `);
		await queryRunner.query(`CREATE INDEX "IDX_695aeb944b5405a804945274df" ON "users_friend_list_users" ("usersId_2") `);
		await queryRunner.query(
			`CREATE TABLE "users_blocked_list_users" ("usersId_1" integer NOT NULL, "usersId_2" integer NOT NULL, CONSTRAINT "PK_5cddd3ad44466554ed8b252cb35" PRIMARY KEY ("usersId_1", "usersId_2"))`,
		);
		await queryRunner.query(`CREATE INDEX "IDX_a941cd94bb207f00eff92ce4a7" ON "users_blocked_list_users" ("usersId_1") `);
		await queryRunner.query(`CREATE INDEX "IDX_7aec76af0d8a8f876fcddbf763" ON "users_blocked_list_users" ("usersId_2") `);
		await queryRunner.query(
			`ALTER TABLE "message_attachments" ADD CONSTRAINT "FK_5b4f24737fcb6b35ffdd4d16e13" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "message_reactions" ADD CONSTRAINT "FK_7623d77216e8457a552490259e0" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "message_reactions" ADD CONSTRAINT "FK_82d59cb474d00eea46d7e192f28" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages" ADD CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages" ADD CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages" ADD CONSTRAINT "FK_f550135b17eaf7c5452ae5fd4a8" FOREIGN KEY ("replyToId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_fb6add83b1a7acc94433d385692" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "chat_participants" ADD CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5" FOREIGN KEY ("chatId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "chats" ADD CONSTRAINT "FK_5768a56bdd855c5b78ce66c9a37" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "invitations" ADD CONSTRAINT "FK_51d17b715f06218dd7ec1281d6b" FOREIGN KEY ("fromId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "invitations" ADD CONSTRAINT "FK_91ee583bebf26b40550593faa3e" FOREIGN KEY ("toId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "invitations" ADD CONSTRAINT "FK_a704d320fc52f862c40d7787d69" FOREIGN KEY ("groupId") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_fd3bc115cd2466d6fb94cde5f4e" FOREIGN KEY ("invitationId") REFERENCES "invitations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_0bba33986bae5af0e04aaf52179" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_2431702b6cdb11f3508519d0fde" FOREIGN KEY ("reactionId") REFERENCES "message_reactions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages_mentioned_users_users" ADD CONSTRAINT "FK_2f0072d33b2bcc092da47308a72" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages_mentioned_users_users" ADD CONSTRAINT "FK_5686b89f52f9056809ea82e5ec8" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages_seen_by_users" ADD CONSTRAINT "FK_5218d9c5fd3bc21e391472653b1" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "messages_seen_by_users" ADD CONSTRAINT "FK_3b24ca739617132adabb681ee79" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "users_friend_list_users" ADD CONSTRAINT "FK_16b547f39347f28c17f4f88d035" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "users_friend_list_users" ADD CONSTRAINT "FK_695aeb944b5405a804945274df0" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE "users_blocked_list_users" ADD CONSTRAINT "FK_a941cd94bb207f00eff92ce4a70" FOREIGN KEY ("usersId_1") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
		);
		await queryRunner.query(
			`ALTER TABLE "users_blocked_list_users" ADD CONSTRAINT "FK_7aec76af0d8a8f876fcddbf7631" FOREIGN KEY ("usersId_2") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "users_blocked_list_users" DROP CONSTRAINT "FK_7aec76af0d8a8f876fcddbf7631"`);
		await queryRunner.query(`ALTER TABLE "users_blocked_list_users" DROP CONSTRAINT "FK_a941cd94bb207f00eff92ce4a70"`);
		await queryRunner.query(`ALTER TABLE "users_friend_list_users" DROP CONSTRAINT "FK_695aeb944b5405a804945274df0"`);
		await queryRunner.query(`ALTER TABLE "users_friend_list_users" DROP CONSTRAINT "FK_16b547f39347f28c17f4f88d035"`);
		await queryRunner.query(`ALTER TABLE "messages_seen_by_users" DROP CONSTRAINT "FK_3b24ca739617132adabb681ee79"`);
		await queryRunner.query(`ALTER TABLE "messages_seen_by_users" DROP CONSTRAINT "FK_5218d9c5fd3bc21e391472653b1"`);
		await queryRunner.query(`ALTER TABLE "messages_mentioned_users_users" DROP CONSTRAINT "FK_5686b89f52f9056809ea82e5ec8"`);
		await queryRunner.query(`ALTER TABLE "messages_mentioned_users_users" DROP CONSTRAINT "FK_2f0072d33b2bcc092da47308a72"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_2431702b6cdb11f3508519d0fde"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_0bba33986bae5af0e04aaf52179"`);
		await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_fd3bc115cd2466d6fb94cde5f4e"`);
		await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_a704d320fc52f862c40d7787d69"`);
		await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_91ee583bebf26b40550593faa3e"`);
		await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_51d17b715f06218dd7ec1281d6b"`);
		await queryRunner.query(`ALTER TABLE "chats" DROP CONSTRAINT "FK_5768a56bdd855c5b78ce66c9a37"`);
		await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_e16675fae83bc603f30ae8fbdd5"`);
		await queryRunner.query(`ALTER TABLE "chat_participants" DROP CONSTRAINT "FK_fb6add83b1a7acc94433d385692"`);
		await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_f550135b17eaf7c5452ae5fd4a8"`);
		await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_36bc604c820bb9adc4c75cd4115"`);
		await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_2db9cf2b3ca111742793f6c37ce"`);
		await queryRunner.query(`ALTER TABLE "message_reactions" DROP CONSTRAINT "FK_82d59cb474d00eea46d7e192f28"`);
		await queryRunner.query(`ALTER TABLE "message_reactions" DROP CONSTRAINT "FK_7623d77216e8457a552490259e0"`);
		await queryRunner.query(`ALTER TABLE "message_attachments" DROP CONSTRAINT "FK_5b4f24737fcb6b35ffdd4d16e13"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_7aec76af0d8a8f876fcddbf763"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_a941cd94bb207f00eff92ce4a7"`);
		await queryRunner.query(`DROP TABLE "users_blocked_list_users"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_695aeb944b5405a804945274df"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_16b547f39347f28c17f4f88d03"`);
		await queryRunner.query(`DROP TABLE "users_friend_list_users"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_3b24ca739617132adabb681ee7"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_5218d9c5fd3bc21e391472653b"`);
		await queryRunner.query(`DROP TABLE "messages_seen_by_users"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_5686b89f52f9056809ea82e5ec"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_2f0072d33b2bcc092da47308a7"`);
		await queryRunner.query(`DROP TABLE "messages_mentioned_users_users"`);
		await queryRunner.query(`DROP TABLE "users"`);
		await queryRunner.query(`DROP TABLE "notifications"`);
		await queryRunner.query(`DROP TABLE "invitations"`);
		await queryRunner.query(`DROP TABLE "chats"`);
		await queryRunner.query(`DROP TABLE "chat_participants"`);
		await queryRunner.query(`DROP TABLE "messages"`);
		await queryRunner.query(`DROP TABLE "message_reactions"`);
		await queryRunner.query(`DROP TABLE "message_attachments"`);
	}
}
