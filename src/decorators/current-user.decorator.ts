import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { verifyAccessToken } from 'src/helpers/JwtHelper';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (token) {
      return request.user;
    }
  },
);
