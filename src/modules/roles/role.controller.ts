import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleResponse } from './dto/role-response.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleService } from './role.service';

@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
export class RoleController extends ControllerFactory<
  RoleEntity,
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponse
>(RoleEntity, CreateRoleDto, UpdateRoleDto, RoleResponse) {
  constructor(protected roleService: RoleService) {
    super(roleService);
  }
}
