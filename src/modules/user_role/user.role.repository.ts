import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRolesEntity } from './entities/user.role.entity';

@Injectable()
export class UserRoleRepository extends Repository<UserRolesEntity> {
  constructor(private dataSource: DataSource) {
    super(UserRolesEntity, dataSource.createEntityManager());
  }
}
