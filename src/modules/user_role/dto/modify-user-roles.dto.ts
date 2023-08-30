import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, Validate } from 'class-validator';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { MESSAGES } from 'src/common/messages';

const {
  ROLE: {
    ERROR: { ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class ModifyUserRolesRequest {
  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  @ArrayNotEmpty({
    message: 'You need to define atleast one role',
  })
  added_roles: RoleEntity[] | null;

  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  @ArrayNotEmpty({
    message: 'You need to define atleast one role',
  })
  deleted_roles: RoleEntity[] | null;
}
