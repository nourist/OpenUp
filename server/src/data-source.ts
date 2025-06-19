import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT!,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: false,
	logging: false,
	entities: [__dirname + '/entities/*.entity{.ts,.js}'],
	migrations: [__dirname + '/migrations/*{.ts,.js}'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
