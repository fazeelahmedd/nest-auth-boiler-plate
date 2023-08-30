import { Exclude, Expose } from 'class-transformer';
import { Column } from 'typeorm';

@Exclude()
export class ModifyRouteRolesResponse {
  @Expose()
  @Column({
    name: 'id',
  })
  id: number;

  @Expose()
  @Column({
    name: 'name',
  })
  name: string;
}
