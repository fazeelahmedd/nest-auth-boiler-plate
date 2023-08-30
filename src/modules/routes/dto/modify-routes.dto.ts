import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, Validate } from 'class-validator';
import { RoleEntity } from 'src/modules/roles/entities/role.entity';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { RouteEntity } from '../entities/route.entity';
import { MESSAGES } from 'src/common/messages';

const {
  ROLE: {
    ERROR: { ATLEAST_ONE_ROLE, ROLE_DOES_NOT_EXIST },
  },
} = MESSAGES;

export class ModifyRouteDto {
  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  @ArrayNotEmpty({
    message: ATLEAST_ONE_ROLE,
  })
  new_roles: RouteEntity[] | null;

  @ApiProperty({ type: RoleEntity })
  @IsArray()
  @Validate(IsMultipleExist, ['roles', 'id'], {
    message: ROLE_DOES_NOT_EXIST,
  })
  @ArrayNotEmpty({
    message: ATLEAST_ONE_ROLE,
  })
  delete_roles: RouteEntity[] | null;
}
