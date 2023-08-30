import { registerAs } from '@nestjs/config';
import { appEnv } from '../helpers/EnvHelper';
export default registerAs('database', () => ({
  url: appEnv('DATABASE_URL'),
  type: appEnv('DATABASE_TYPE'),
  host: appEnv('DATABASE_HOST'),
  port: parseInt(appEnv('DATABASE_PORT'), 10),
  password: appEnv('DATABASE_PASSWORD'),
  name: appEnv('DATABASE_NAME'),
  username: appEnv('DATABASE_USERNAME'),
  synchronize: appEnv('DATABASE_SYNCHRONIZE'),
  maxConnections: parseInt(appEnv('DATABASE_MAX_CONNECTIONS'), 10),
  sslEnabled: appEnv('DATABASE_SSL_ENABLED') === 'true',
  rejectUnauthorized: appEnv('DATABASE_REJECT_UNAUTHORIZED') === 'true',
  ca: appEnv('DATABASE_CA'),
  key: appEnv('DATABASE_KEY'),
  cert: appEnv('DATABASE_CERT'),
}));
