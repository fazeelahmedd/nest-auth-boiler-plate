import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MESSAGES } from 'src/common/messages';
const {
  AUTH: {
    ERROR: { TOKEN_EXPIRED, TOKEN_INVALID, TOKEN_INVALID_OR_EXPIRED },
  },
} = MESSAGES;

export class RefreshAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
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
}
