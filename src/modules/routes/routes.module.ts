import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteEntity } from './entities/route.entity';
import { RouteRepository } from './route.repository';
import { RoleRepository } from '../roles/role.repository';
import { CacheService } from 'src/helpers/CacheService';
import { UserRoleRepository } from '../user_role/user.role.repository';
import { UserRolesEntity } from '../user_role/entities/user.role.entity';
import { RoutePermissionRepository } from '../route_permission/route.permission.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RouteEntity])],
  providers: [
    RoutesService,
    RouteRepository,
    RouteEntity,
    RoleRepository,
    CacheService,
    UserRoleRepository,
    UserRolesEntity,
    RoutePermissionRepository,
  ],
  controllers: [RoutesController],
  exports: [RoutesService, RouteRepository],
})
export class RoutesModule {}
