import { Entity, Column, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { RoutePermissionEntity } from '../../route_permission/entities/route.permission.entity';
import { UserRolesEntity } from '../../user_role/entities/user.role.entity';

@Entity('roles')
export class RoleEntity extends DefaultEntity {
  @Column()
  name: string;

  @OneToMany(() => UserRolesEntity, (ur) => ur.roles, { cascade: true })
  user_roles: UserRolesEntity[];

  @OneToMany(() => RoutePermissionEntity, (rp) => rp.roles, { cascade: true })
  route_permissions: RoutePermissionEntity[];
}
