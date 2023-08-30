import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import { Match } from 'src/utils/validators/match.decorator';
import { MESSAGES } from 'src/common/messages';

const {
  EMAIL: {
    ERROR: { EMAIL_DOES_NOT_EXIST },
  },
  PASSWORD: {
    ERROR: { PASSWORD_RULES },
  },
} = MESSAGES;

export class AuthChangePasswordDto {
  @ApiProperty({ example: 'info@inaequo.net' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['users'], {
    message: EMAIL_DOES_NOT_EXIST,
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d).{6,16}$/i, {
    message: PASSWORD_RULES,
  })
  new_password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Match('password', {
    message: 'new_password must matches confirm_new_password',
  })
  confirm_new_password: string;
}
