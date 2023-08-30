import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async FindUserWithRoleAndPassword(data: any): Promise<UserEntity[]> {
    const user = await this.dataSource.manager.query(`select
      u.id,
      u.name,
      email ,
      "password" ,
      is_verified ,
      is_enabled ,
      is_active,
      string_to_array(string_agg(r."name" ::character varying,
    ','
    ), ',') as roles,
    string_to_array(string_agg(r."id" ::character varying,
    ','
    ), ',')::int[] as role_ids
    from
      users u
    inner join user_roles ur on
      u.id = ur.user_id
    inner join roles r on
      r.id = ur.role_id
    where email= '${data.email}'
    group by
      u.id,
      u.name,
      email ,
      "password" ,
      is_verified ,
      is_enabled,
      is_active;`);
    return user[0];
  }
}
