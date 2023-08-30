import {
  CacheModuleOptions,
  CacheOptionsFactory,
  Injectable,
} from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CacheConfigService
  implements CacheOptionsFactory<RedisClientOptions>
{
  constructor(private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  createCacheOptions(): CacheModuleOptions<RedisClientOptions> {
    return {
      ttl: this.configService.get('cache.expiry'),
      store: redisStore,
      url: this.configService.get('cache.url'),
      isGlobal: true,
    };
  }
}
