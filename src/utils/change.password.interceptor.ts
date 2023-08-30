/* eslint-disable @typescript-eslint/naming-convention */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { verify } from 'jsonwebtoken';
import { appEnv } from 'src/helpers/EnvHelper';
import { UserRepository } from 'src/modules/users/user.repository';
import { Comparepassword } from 'src/helpers/UtilHelper';
import { MESSAGES } from 'src/common/messages';

const {
  AUTH: {
    ERROR: { DIFFERENT_OLD_NEW_PASSWORD },
  },
} = MESSAGES;

@Injectable()
export class ChangePasswordInterceptor implements NestInterceptor {
  constructor(private userRepository: UserRepository) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const {
      query: { token },
      body: { password: password },
    } = context.switchToHttp().getRequest();
    const { email }: any = await verify(token, appEnv('FPTOKEN_SECRET'));
    const { password: old_password }: any =
      await this.userRepository.FindUserWithRoleAndPassword({
        email,
      });
    const same_password = await Comparepassword(password, old_password);
    if (same_password) {
      throw new BadRequestException(DIFFERENT_OLD_NEW_PASSWORD);
    }
    return next.handle().pipe();
  }
}
