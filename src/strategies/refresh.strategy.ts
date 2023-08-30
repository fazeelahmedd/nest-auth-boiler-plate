/* eslint-disable @typescript-eslint/naming-convention */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { appEnv } from 'src/helpers/EnvHelper';
import { MESSAGES } from 'src/common/messages';

const {
  AUTH: {
    ERROR: { REFRESH_MALFORMED },
  },
} = MESSAGES;

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appEnv('REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refresh_token = req
      ?.get('authorization')
      ?.replace('Bearer', '')
      .trim();

    if (!refresh_token) throw new ForbiddenException(REFRESH_MALFORMED);

    return {
      ...payload,
      refresh_token,
    };
  }
}
