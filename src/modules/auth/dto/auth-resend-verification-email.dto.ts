import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { JwtOtpPayload } from '../auth.interface';
import { MESSAGES } from 'src/common/messages';

const {
  USER: {
    ERROR: { USER_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class AuthResendVerificationEmailDto {
  @ApiProperty({ type: UserEntity })
  @IsNumber()
  @Validate(IsExist, ['users', 'id'], {
    message: USER_DOES_NOT_EXIST,
  })
  user_id: number | null;
}
