import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DefaultEntity } from '../../base/entities/base.entity';
import { UserEntity } from '../../users/entities/user.entity';
@Entity('otp')
export class OtpEntity extends DefaultEntity {
  @Column()
  code: string;

  @Column({
    type: 'timestamptz',
  })
  expiry_time: Date;

  @Column({
    name: 'is_used',
    type: 'boolean',
    default: false,
  })
  is_used: boolean;

  @Column()
  user_id: number;

  @ManyToOne(() => UserEntity, (user) => user.user_roles, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  users: UserEntity;
}
