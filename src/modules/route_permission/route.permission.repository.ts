import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoutePermissionEntity } from './entities/route.permission.entity';

@Injectable()
export class RoutePermissionRepository extends Repository<RoutePermissionEntity> {
  constructor(private dataSource: DataSource) {
    super(RoutePermissionEntity, dataSource.createEntityManager());
  }
}
