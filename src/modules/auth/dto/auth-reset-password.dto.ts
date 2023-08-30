import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

import { MESSAGES } from 'src/common/messages';
import { Match } from 'src/utils/validators/match.decorator';

const {
  PASSWORD: { ERROR: PASSWORD_RULES },
} = MESSAGES;

export class AuthResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d).{6,16}$/i, {
    message: `${PASSWORD_RULES}`,
  })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Match('password', { message: 'Password must matches confirm_password' })
  confirm_password: string;
}
