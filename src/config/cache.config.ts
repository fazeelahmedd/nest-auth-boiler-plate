import { registerAs } from '@nestjs/config';
import { appEnv } from '../helpers/EnvHelper';

export default registerAs('cache', () => ({
  expiry: parseInt(appEnv('REDIS_EXPIRY'), 10),
  permissionsExpiry: parseInt(appEnv('REDIS_PERMISSIONS_EXPIRY'), 10),
  url: appEnv('REDIS_URL'),
}));
