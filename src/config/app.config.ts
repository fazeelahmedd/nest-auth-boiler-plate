import { registerAs } from '@nestjs/config';
import { appEnv } from 'src/helpers/EnvHelper';

export default registerAs('app', () => ({
  nodeEnv: appEnv('NODE_ENV'),
  name: appEnv('APP_NAME'),
  workingDirectory: appEnv('PWD') || process.cwd(),
  frontendDomain: appEnv('FRONTEND_DOMAIN'),
  backendDomain: appEnv('BACKEND_DOMAIN'),
  port: parseInt(appEnv('APP_PORT'), 10),
  apiPrefix: appEnv('API_PREFIX') || 'api',
  fallbackLanguage: appEnv('APP_FALLBACK_LANGUAGE'),
}));
