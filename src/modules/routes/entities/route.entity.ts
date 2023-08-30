import { Entity, Column, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { RoutePermissionEntity } from '../../route_permission/entities/route.permission.entity';
export interface IRedisUserModel {
  user_id: number;
  role: string;
  role_id: number;
}
@Entity('routes')
export class RouteEntity extends DefaultEntity {
  @Column()
  request_type: string;

  @Column()
  end_point: string;

  @OneToMany(() => RoutePermissionEntity, (rp) => rp.routes, { cascade: true })
  route_permissions: RoutePermissionEntity[];
}
