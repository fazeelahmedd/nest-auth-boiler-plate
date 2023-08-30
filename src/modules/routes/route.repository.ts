import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RouteEntity } from './entities/route.entity';

@Injectable()
export class RouteRepository extends Repository<RouteEntity> {
  constructor(private dataSource: DataSource) {
    super(RouteEntity, dataSource.createEntityManager());
  }
  async FindRoutePermissionsByID(data: any): Promise<any> {
    const route_permissions = await this.createQueryBuilder('r')
      .select(['r.id as id', 'request_type', 'end_point'])
      .innerJoin('r.route_permissions', 'rp')
      .where(`rp.role_id= '${data.role_id}'`)
      .getRawMany();
    return route_permissions;
  }
}
