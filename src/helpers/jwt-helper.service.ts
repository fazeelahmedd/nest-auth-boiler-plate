import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MESSAGES, ResponseMessage } from 'src/common/messages';
import { JwtAccessPayload } from 'src/modules/auth/auth.interface';
import client from './RedisHelper';

const {
  AUTH: {
    ERROR: { TOKEN_INVALID_OR_EXPIRED, LOGGED_OUT },
  },
} = MESSAGES;

const { SERVER_ERROR } = ResponseMessage;

@Injectable()
export class JwtHelperService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  public SignAccessToken = async (
    payload: JwtAccessPayload,
  ): Promise<string> => {
    try {
      return this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRY'),
      });
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  };

  public SignOtpToken = async (payload): Promise<string> => {
    try {
      return this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  };

  public SignRefreshToken = async (
    payload: JwtAccessPayload,
  ): Promise<string> => {
    try {
      // const payload: JwtPayload = { user_id, role, role_id };
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRY'),
      });
      await client.set(`${payload.user_id}-${payload.role_ids}`, refresh_token);
      await client.expire(
        `${payload.user_id}-${payload.role_ids}`,
        365 * 24 * 60 * 60,
      );
      return refresh_token;
    } catch (error) {
      throw new InternalServerErrorException(SERVER_ERROR);
    }
  };

  public VerifyAccessToken = async (accessToken: string) => {
    try {
      let payload: any;
      const token = accessToken.replace('Bearer', '').trim();
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        });
      } catch (error) {
        throw new UnauthorizedException(TOKEN_INVALID_OR_EXPIRED);
      }
      return payload;
    } catch (error) {
      throw error;
    }
  };

  public VerifyOtpToken = async (token: string) => {
    try {
      let payload: any;
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        });
      } catch (error) {
        throw new UnauthorizedException(TOKEN_INVALID_OR_EXPIRED);
      }
      return payload;
    } catch (error) {
      throw error;
    }
  };

  public VerifyRefreshToken = async (refresh_token: string) => {
    try {
      let payload: any;
      const token = refresh_token.replace('Bearer', '').trim();
      try {
        payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        });
      } catch (error) {
        throw new InternalServerErrorException(TOKEN_INVALID_OR_EXPIRED);
      }
      const redis_token = await client.get(
        `${payload.user_id}-${payload.role_id}`,
      );
      if (refresh_token === redis_token) {
        return payload;
      } else {
        throw new UnauthorizedException(LOGGED_OUT);
      }
    } catch (error) {
      throw error;
    }
  };
}
