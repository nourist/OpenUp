import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FriendModule } from './modules/friend/friend.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './modules/notification/notification.module';
import { GroupModule } from './modules/group/group.module';
import { InvitationModule } from './modules/invitation/invitation.module';
import { GoogleService } from './modules/google/google.service';
import { GoogleModule } from './modules/google/google.module';
import { MessageModule } from './modules/message/message.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DevtoolsModule.register({
			http: process.env.NODE_ENV !== 'production',
		}),
		ScheduleModule.forRoot(),
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: 'postgres',
				host: process.env.DB_HOST,
				port: +process.env.DB_PORT!,
				username: process.env.DB_USERNAME,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				autoLoadEntities: true,
				synchronize: process.env.NODE_ENV !== 'production',
			}),
			dataSourceFactory: (options) => {
				if (!options) {
					throw new Error('Invalid options passed');
				}

				const ds = new DataSource(options);
				return ds.initialize().then(addTransactionalDataSource);
			},
		}),
		ServeStaticModule.forRoot({
			rootPath: join(__dirname, '..', 'uploads'),
			serveRoot: '/uploads',
		}),
		AuthModule,
		UserModule,
		FriendModule,
		ChatModule,
		NotificationModule,
		GroupModule,
		InvitationModule,
		GoogleModule,
		MessageModule,
		RedisModule,
	],
	controllers: [AppController],
	providers: [AppService, GoogleService],
})
export class AppModule {}
