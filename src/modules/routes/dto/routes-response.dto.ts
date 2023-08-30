import { Exclude, Expose, Transform } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class RoutesResponse {
  @Expose()
  @Column({
    name: 'id',
  })
  id: number;

  @Expose()
  @Column({
    name: 'request_type',
  })
  request_type: string;

  @Expose()
  @Column({
    name: 'end_point',
  })
  end_point: string;

  @Transform(({ value }) => {
    if (value) {
      return value.map((roles) => {
        return roles.roles ? roles.roles.name : roles;
      });
    } else {
      return [];
    }
  })
  @Expose()
  user_roles: string[];
}
