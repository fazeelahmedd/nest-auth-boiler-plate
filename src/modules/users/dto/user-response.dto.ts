import { Exclude, Expose, Transform } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class UserResponse {
  @Expose()
  @Column({
    name: 'id',
  })
  id: number;

  @Expose()
  @Column({
    name: 'name',
    nullable: true,
  })
  name: string;

  @Expose()
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

  @Expose()
  @Column({
    name: 'verified',
    type: 'boolean',
    default: false,
  })
  verified: boolean;

  @Expose()
  @Column({
    name: 'approved',
    type: 'boolean',
    default: false,
  })
  approved: boolean;

  @Expose()
  @Column({
    name: 'phone_no',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  phone_no: string;

  @Expose()
  @Transform(({ value }) => {
    if (value) {
      return value.map((roles) => {
        return roles.roles ? roles.roles.name : roles;
      });
    } else {
      return [];
    }
  })
  user_roles: string[];

  @Expose()
  otp_token: string;
}
