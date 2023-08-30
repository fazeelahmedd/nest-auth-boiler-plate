import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { Transform } from 'class-transformer';
import { MESSAGES } from 'src/common/messages';

const {
  EMAIL: {
    ERROR: { EMAIL_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class AuthEmailLoginDto {
  @ApiProperty({ example: 'info@inaequo.net' })
  @Transform(({ value }) => value.toLowerCase().trim())
  @Validate(IsExist, ['users'], {
    message: EMAIL_DOES_NOT_EXIST,
  })
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
