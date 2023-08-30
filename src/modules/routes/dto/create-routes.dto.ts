import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsString,
  Length,
  Validate,
} from 'class-validator';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { MESSAGES } from 'src/common/messages';

const {
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
  ROUTE: {
    ERROR: { ROUTE_IS_EXIST },
  },
} = MESSAGES;

export class CreateRoutesDto {
  @Transform(({ value }) => value.toUpperCase().trim())
  @ApiProperty({ example: 'GET' })
  @Length(1, 255)
  @IsNotEmpty()
  @IsString()
  request_type: string;

  @ApiProperty({ example: 'user/create' })
  @Transform(({ value }) => `/api/v1/${value}`)
  @Validate(IsNotExist, ['routes'], {
    message: ROUTE_IS_EXIST,
  })
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
  roles: number[];
}
