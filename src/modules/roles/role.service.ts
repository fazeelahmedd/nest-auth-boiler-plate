import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '../base/base.service';
import { UserResponse } from '../users/dto/user-response.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEntity } from './entities/role.entity';
import { RoleRepository } from './role.repository';

@Injectable()
export class RoleService extends BaseService<
  RoleEntity,
  CreateRoleDto,
  UpdateRoleDto,
  UserResponse
> {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: RoleRepository,
  ) {
    super(roleRepository);
  }
}
