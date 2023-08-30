import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { MESSAGES } from 'src/common/messages';

const {
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class UpdateRoutesDto {
  @ApiProperty({ example: 'GET' })
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  request_type: string;

  @ApiProperty({ example: 'user/create' })
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  end_point: string;

  @ApiProperty({ example: [1, 2] })
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  @IsNotEmpty()
  @IsArray()
  new_roles: number[];

  @ApiProperty({ example: [1, 2] })
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  @IsNotEmpty()
  @IsArray()
  deleted_roles: number[];
}
