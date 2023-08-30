import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import { UserEntity } from '../../users/entities/user.entity';
@Entity('user_roles')
export class UserRolesEntity extends DefaultEntity {
  // @Exclude()
  @Column()
  user_id: number;

  // @Exclude()
  @Column()
  role_id: number;

  @ManyToOne(() => UserEntity, (user) => user.user_roles, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  users: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.user_roles, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  roles: RoleEntity;
}
