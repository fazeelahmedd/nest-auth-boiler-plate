// import { Transform } from 'class-transformer';
// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsArray,
//   IsEmail,
//   IsOptional,
//   MinLength,
//   Validate,
// } from 'class-validator';
// import { IsNotExist } from '../../../utils/validators/is-not-exists.validator';
// import { RoleEntity } from 'src/modules/roles/entities/role.entity';
// import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist';

// export class UpdateUserDto {
//   @ApiProperty({ example: 'test1@example.com' })
//   @Transform(({ value }) => value?.toLowerCase().trim())
//   @IsOptional()
//   @Validate(IsNotExist, ['User'], {
//     message: 'emailAlreadyExists',
//   })
//   @IsEmail()
//   email?: string | null;

//   @ApiProperty()
//   @IsOptional()
//   @MinLength(6)
//   password?: string;

//   @ApiProperty({ example: 'John' })
//   @IsOptional()
//   firstName?: string | null;

//   @ApiProperty({ example: 'Doe' })
//   @IsOptional()
//   lastName?: string | null;

//   @ApiProperty({ type: RoleEntity })
//   @IsArray()
//   @Validate(IsMultipleExist, ['roles', 'id'], {
//     message: "role doesn't exist",
//   })
//   roles: RoleEntity[] | null;
// }

import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { CreateUserDto } from './create-user.dto';
import { MESSAGES } from 'src/common/messages';

const {
  EMAIL: {
    ERROR: { INVALID_EMAIL, EMAIL_DOES_NOT_EXIST },
  },
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;
// export class GetUserDto {
//   @ApiProperty({ example: 1 })
//   @IsNotEmpty()
//   @IsNumber()
//   id: number | null;

//   @ApiProperty({ example: 'Doe' })
//   @IsNotEmpty()
//   @IsBoolean()
//   verified: boolean | null;
// }

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'roles',
  'email',
] as const) {
  @ApiProperty({ example: 'info@inaequo.net' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsExist, ['users'], {
    message: EMAIL_DOES_NOT_EXIST,
  })
  @IsEmail()
  @IsString()
  @Matches(
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i,
    {
      message: INVALID_EMAIL,
    },
  )
  email: string | null;

  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  added_roles: RoleEntity[] | null;

  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  deleted_roles: RoleEntity[] | null;

  @ApiProperty({ example: 'Inaequo Solutions' })
  @IsNotEmpty()
  @IsBoolean()
  verified: boolean | null;

  @ApiProperty({ example: 'Inaequo Solutions' })
  @IsNotEmpty()
  @IsBoolean()
  approved: boolean | null;
}
