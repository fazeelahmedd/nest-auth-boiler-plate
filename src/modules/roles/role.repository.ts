import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RoleEntity } from './entities/role.entity';

@Injectable()
export class RoleRepository extends Repository<RoleEntity> {
  constructor(private dataSource: DataSource) {
    super(RoleEntity, dataSource.createEntityManager());
  }

  async GetPermissions(role: string) {
    const redis_permissions = await this.createQueryBuilder('r')
      .select([
        'route.id as id, route.request_type as request_type,route.end_point as end_point',
      ])
      .innerJoin('r.route_permissions', 'rp')
      .innerJoin('rp.routes', 'route')
      .where(`r.name='${role}'`)
      .getRawMany();
    return redis_permissions;
  }
}
