/* eslint-disable @typescript-eslint/naming-convention */
import { UserEntity } from '../../modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { Hashpassword } from '../../helpers/UtilHelper';
import { RoleEntity } from '../../modules/roles/entities/role.entity';
import { UserRolesEntity } from '../../modules/user_role/entities/user.role.entity';
import { plainToInstance } from 'class-transformer';
import { RouteEntity } from '../../modules/routes/entities/route.entity';
import { RoutePermissionEntity } from '../../modules/route_permission/entities/route.permission.entity';

export class InitialSeeder implements Seeder {
  async run(factory: Factory, dataSource: DataSource): Promise<void> {
    const user_payload = {
      name: 'Inaequo Solutions',
      email: 'info@inaequo.net',
      password: await Hashpassword('testing123'),
      is_verified: true,
      is_enabled: true,
      is_active: true,
    };

    const role_payload = [
      {
        name: 'inaequo_admin',
      },
      {
        name: 'user',
      },
    ];
    const user_role_payload = {
      user_id: null,
      role_id: null,
    };

    const route_payload = {
      request_type: 'POST',
      end_point: '/api/v1/routes/create',
    };

    const route_permissions_payload = {
      route_id: null,
      role_id: null,
    };
    const query_runner = dataSource.createQueryRunner();
    await query_runner.connect();
    await query_runner.startTransaction();
    try {
      const user_entity = plainToInstance(UserEntity, user_payload);
      const user_promise = query_runner.manager.save(user_entity);

      const role_entity = plainToInstance(RoleEntity, role_payload);
      const role_promise = query_runner.manager.save(role_entity);

      const route_entity = plainToInstance(RouteEntity, route_payload);
      const route_promise = query_runner.manager.save(route_entity);

      const [user, role, route] = await Promise.all([
        user_promise,
        role_promise,
        route_promise,
      ]);

      user_role_payload.user_id = user.id;
      user_role_payload.role_id = role[0].id;
      const user_role_entity = plainToInstance(
        UserRolesEntity,
        user_role_payload,
      );
      await query_runner.manager.save(user_role_entity);

      route_permissions_payload.route_id = route.id;
      route_permissions_payload.role_id = role[0].id;
      const route_permissions_entity = plainToInstance(
        RoutePermissionEntity,
        route_permissions_payload,
      );
      await query_runner.manager.save(route_permissions_entity);

      await query_runner.commitTransaction();
    } catch (error) {
      await query_runner.rollbackTransaction();
    } finally {
      await query_runner.release();
    }
  }
}
