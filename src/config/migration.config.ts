import { appEnv } from '../helpers/EnvHelper';
import { DataSource } from 'typeorm';
export const app_data_source = new DataSource({
  type: appEnv('DATABASE_TYPE'),
  host: appEnv('DATABASE_HOST'),
  port: appEnv('DATABASE_PORT'),
  username: appEnv('DATABASE_USERNAME'),
  password: appEnv('DATABASE_PASSWORD'),
  database: appEnv('DATABASE_NAME'),
  entities: ['src/**/**.entity{.ts,.js}'],
  migrations: ['src/migrations/*.{ts,js}'],
});

// eslint-disable-next-line @typescript-eslint/no-floating-promises
app_data_source.initialize();
