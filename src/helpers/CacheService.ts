import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async Get<T>(key: string): Promise<T> {
    const value = await this.cacheManager.get<string>(key);
    return JSON.parse(value);
  }

  async Set<T>(key: string, data: T, options?: { ttl?: number }) {
    return await this.cacheManager.set(key, JSON.stringify(data), options);
  }
}
