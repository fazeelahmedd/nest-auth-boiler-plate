import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { appEnv } from 'src/helpers/EnvHelper';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { JwtAccessPayload } from 'src/modules/auth/auth.interface';
import { ConfigService } from '@nestjs/config';
import { RoleRepository } from 'src/modules/roles/role.repository';
import { ResponseMessage } from 'src/common/messages';
import { CacheService } from 'src/helpers/CacheService';
import { JwtPayloadWithExp } from 'src/modules/auth/auth.interface';
import { UserRepository } from 'src/modules/users/user.repository';

const { FORBIDDEN } = ResponseMessage;

const create_dynamic_api_url = (params: Record<any, any>, url: string) => {
  const entries = {};
  for (const [key, value] of Object.entries(params)) {
    if (value in entries) {
      entries[value].push(key);
    } else {
      entries[value] = [key];
    }
  }
  const start_index_of_query = url.indexOf('?');
  const query_params_str =
    start_index_of_query !== -1
      ? url.slice(start_index_of_query, url.length)
      : '';
  const url_parts = url.replace(query_params_str, '').split('/');
  return url_parts
    .map((e, _idx) => {
      if (e in entries) {
        const keys: any[] = entries[e];
        return ':' + keys.shift();
      }
      return e;
    })
    .join('/');
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private datasource: DataSource,
    private configService: ConfigService,
    private roleRepository: RoleRepository,
    private cacheService: CacheService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appEnv('ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  CheckRequiredPermissions(permissions, url): boolean {
    const required_permission = permissions.some(
      (perm) => perm.end_point === url,
    );
    if (required_permission) {
      return true;
    } else {
      throw new ForbiddenException(FORBIDDEN);
    }
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async validate(
    req: Request,
    payload: JwtPayloadWithExp,
  ): Promise<JwtAccessPayload> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { method, params, originalUrl } = req;
    let url = originalUrl;
    const start_index_of_query = url.indexOf('?');
    const query_params_str =
      start_index_of_query !== -1
        ? url.slice(start_index_of_query, url.length)
        : '';
    url = url.replace(query_params_str, '');
    // url = url.slice(0, url.indexOf('?') + 1);
    const method_types = ['GET', 'PUT', 'PATCH', 'DELETE'];
    if (method_types.includes(method) && Object.keys(params).length !== 0) {
      url = create_dynamic_api_url(params, url);
    }
    const redis_promises = payload.roles.map((role) => {
      return new Promise(async (res, rej) => {
        try {
          const key = `${role}_permissions`;
          const output = await this.cacheService.Get(key);
          if (!output) {
            const redis_permissions = await this.roleRepository.GetPermissions(
              role,
            );
            await this.cacheService.Set(key, redis_permissions, {
              ttl: this.configService.get('cache.permissionsExpiry'),
            });
            res(redis_permissions);
          } else {
            res(output);
          }
        } catch (error) {
          rej(error);
        }
      });
    });
    const permissions = (await Promise.all(redis_promises)).flatMap((e) => e);
    this.CheckRequiredPermissions(permissions, url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { iat, exp, ...user } = payload;
    return user;
  }
}
