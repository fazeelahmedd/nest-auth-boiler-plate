import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { MESSAGES } from 'src/common/messages';

const {
  AUTH: { ERROR: MUST_NOT_BE_EMPTY },
} = MESSAGES;

export class AuthUpdateDto {
  @ApiProperty({ example: 'Inaequo Solutions' })
  @IsOptional()
  @IsNotEmpty({ message: `${MUST_NOT_BE_EMPTY}` })
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty({ message: `${MUST_NOT_BE_EMPTY}` })
  oldPassword: string;
}
