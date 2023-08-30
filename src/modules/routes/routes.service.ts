import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { CreateRoutesDto } from './dto/create-routes.dto';
import { RoutesResponse } from './dto/routes-response.dto';
import { UpdateRoutesDto } from './dto/update-routes.dto';
import { RouteEntity } from './entities/route.entity';
import { RouteRepository } from './route.repository';
import { Request } from 'express';
import { RoleRepository } from '../roles/role.repository';
import { DataSource, In } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { RoutePermissionEntity } from '../route_permission/entities/route.permission.entity';
import { RoleEntity } from '../roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { ResponseMessage } from 'src/common/messages';
import { CacheService } from 'src/helpers/CacheService';
import { ModifyRouteDto } from './dto/modify-routes.dto';
import { UserRoleRepository } from '../user_role/user.role.repository';
import { RoutePermissionRepository } from '../route_permission/route.permission.repository';
import { IRedisUserModel } from '../base/base.interface';
import { appEnv } from 'src/helpers/EnvHelper';

const { SERVER_ERROR } = ResponseMessage;

@Injectable()
export class RoutesService extends BaseService<
  RouteEntity,
  CreateRoutesDto,
  UpdateRoutesDto,
  RoutesResponse
> {
  constructor(
    private routeRepository: RouteRepository,
    private roleRepository: RoleRepository,
    private dataSource: DataSource,
    private configService: ConfigService,
    private cacheService: CacheService,
    private userRoleRepository: UserRoleRepository,
    private routePermissionRepository: RoutePermissionRepository,
  ) {
    super(routeRepository);
  }

  async Create(body: CreateRoutesDto, _req: Request): Promise<any> {
    const { roles, ...route_data } = body;
    const route = await plainToInstance(RouteEntity, route_data);

    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.connect();
    await query_runner.startTransaction();
    try {
      const route_details: RouteEntity = await query_runner.manager.save(route);

      const route_permissions: RoutePermissionEntity[] = roles.map(
        (role: number) => {
          const route_role = new RoutePermissionEntity();
          route_role.role_id = role;
          route_role.route_id = route_details.id;
          return route_role;
        },
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const permissions_promise = await query_runner.manager.save(
        route_permissions,
      );

      const user_roles = await this.roleRepository.find({
        select: { name: true },
        where: { id: In(roles) },
      });
      const user_permissions_promise = user_roles.map((role: any) => {
        return new Promise(async (res, rej) => {
          try {
            const permissions = await query_runner.manager
              .getRepository(RoleEntity)
              .createQueryBuilder('r')
              .select([
                'route.id as id, route.request_type as request_type,route.end_point as end_point',
              ])
              .innerJoin('r.route_permissions', 'rp')
              .innerJoin('rp.routes', 'route')
              .where(`r.name='${role.name}'`)
              .getRawMany();

            await this.cacheService.Set(
              `${role.name}_permissions`,
              permissions,
              {
                ttl: parseInt(appEnv('REDIS_PERMISSIONS_EXPIRY'), 10) || 10000,
              },
            );

            res(permissions);
          } catch (error) {
            rej(error);
          }
        });
      });

      await Promise.all(user_permissions_promise);

      await query_runner.commitTransaction();
      const resp: any = await plainToInstance(RoutesResponse, {
        ...route_details,
        user_roles: user_roles,
      });
      return resp;
    } catch (error) {
      await query_runner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException(SERVER_ERROR);
    } finally {
      await query_runner.release();
    }
  }

  async FindRoutePermissionsByID(current_user: IRedisUserModel): Promise<any> {
    try {
      const role_id = current_user.role_id;
      console.log(role_id);
      const resp = await this.routeRepository.FindRoutePermissionsByID({
        role_id,
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }

  public async ModifyRolePermissions(
    data: ModifyRouteDto,
    id: number,
    current_user: IRedisUserModel,
  ): Promise<any> {
    try {
      const route_id = await this.routeRepository.find({
        where: {
          id,
        },
      });

      const { new_roles, delete_roles } = data;
      const deleted_routes = await this.routePermissionRepository.softDelete({
        route_id: id,
        role_id: In(delete_roles),
      });

      const create_route_permissions: RoutePermissionEntity[] = new_roles.map(
        (role) => {
          const route_permission = new RoutePermissionEntity();
          route_permission.role_id = +role;
          route_permission.route_id = id;
          route_permission.created_by = current_user.user_id;
          return route_permission;
        },
      );

      const add_routes = this.routePermissionRepository.save(
        create_route_permissions,
      );
      await Promise.all([route_id, deleted_routes, add_routes]);
      const all_routes = await this.FindOne(id, ['route_permissions']);
      const { route_permissions, ...rest } = all_routes;

      const resp = await plainToInstance(RoutesResponse, {
        ...rest,
        user_roles: route_permissions,
      });
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
