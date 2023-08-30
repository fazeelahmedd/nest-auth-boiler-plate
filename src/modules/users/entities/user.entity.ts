import { Entity, Column, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { UserRolesEntity } from '../../user_role/entities/user.role.entity';

@Entity('users')
export class UserEntity extends DefaultEntity {
  @Column({
    name: 'name',
    nullable: true,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  email: string;

  @Column({
    name: 'password',
    type: 'varchar',
    length: 255,
    select: false,
  })
  password: string;

  @Column({
    name: 'is_verified',
    type: 'boolean',
    default: false,
  })
  is_verified: boolean;

  @Column({
    name: 'is_enabled',
    type: 'boolean',
    default: false,
  })
  is_enabled: boolean;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: false,
  })
  is_active: boolean;

  @OneToMany(() => UserRolesEntity, (ur) => ur.users, { cascade: true })
  user_roles: UserRolesEntity[];
}
