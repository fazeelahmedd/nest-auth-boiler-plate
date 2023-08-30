import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MESSAGES } from 'src/common/messages';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
const {
  AUTH: {
    ERROR: { TOKEN_EXPIRED, TOKEN_INVALID, TOKEN_INVALID_OR_EXPIRED },
  },
} = MESSAGES;

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: any, status: any) {
    if (info instanceof JsonWebTokenError) {
      if (info.name === 'TokenExpiredError') {
        throw new UnauthorizedException(TOKEN_EXPIRED);
      } else if (info.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(TOKEN_INVALID);
      } else {
        throw new UnauthorizedException(TOKEN_INVALID_OR_EXPIRED);
      }
    }

    return super.handleRequest(err, user, info, context, status);
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
