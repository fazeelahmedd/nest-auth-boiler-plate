import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { MESSAGES } from 'src/common/messages';

const {
  ROLE: {
    ERROR: { ROLE_IS_EXIST },
  },
} = MESSAGES;

export class CreateRoleDto {
  @ApiProperty({ example: 'admin' })
  @Validate(IsNotExist, ['roles'], {
    message: ROLE_IS_EXIST,
  })
  @IsNotEmpty()
  @IsString()
  name: string | null;
}
