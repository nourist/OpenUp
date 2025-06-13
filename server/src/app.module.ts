import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { FriendModule } from './modules/friend/friend.module';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DevtoolsModule.register({
			http: process.env.NODE_ENV !== 'production',
		}),
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: process.env.DB_HOST,
			port: +process.env.DB_PORT!,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			autoLoadEntities: true,
			synchronize: process.env.NODE_ENV !== 'production',
		}),
		AuthModule,
		UserModule,
		FriendModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
