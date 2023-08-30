import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import { RouteEntity } from '../../routes/entities/route.entity';

export interface IRedisUserModel {
  user_id: number;
  role: string[];
  role_id: number[];
}
@Entity('route_permissions')
export class RoutePermissionEntity extends DefaultEntity {
  @Column()
  route_id: number;

  @Column()
  role_id: number;

  @ManyToOne(() => RouteEntity, (route) => route.route_permissions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'route_id', referencedColumnName: 'id' })
  routes: RouteEntity;

  @ManyToOne(() => RoleEntity, (role) => role.route_permissions, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  roles: RoleEntity;
}
