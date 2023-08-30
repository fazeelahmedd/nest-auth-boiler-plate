import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { plainToInstance } from 'class-transformer';
import { ControllerFactory } from '../base/base.controller';
import { iResponseJson, IRedisUserModel } from '../base/base.interface';
import { RoutePermissionResponse } from '../route_permission/dto/route-permission-response.dto';
import { CreateRoutesDto } from './dto/create-routes.dto';
import { ModifyRouteDto } from './dto/modify-routes.dto';
import { RoutesResponse } from './dto/routes-response.dto';
import { UpdateRoutesDto } from './dto/update-routes.dto';
import { RouteEntity } from './entities/route.entity';
import { RoutesService } from './routes.service';

@ApiTags('Routes')
@Controller({
  path: 'routes',
  version: '1',
})
export class RoutesController extends ControllerFactory<
  RouteEntity,
  CreateRoutesDto,
  UpdateRoutesDto,
  RoutesResponse
>(RouteEntity, CreateRoutesDto, UpdateRoutesDto, RoutesResponse) {
  constructor(protected routesService: RoutesService) {
    super(routesService);
  }

  @HttpCode(HttpStatus.OK)
  @Patch('modify/roles/:id')
  async ModifyRolePermissions(
    @Param('id') id: number,
    @Body() data: ModifyRouteDto,
    @CurrentUser() current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    const roles = await this.routesService.ModifyRolePermissions(
      data,
      id,
      current_user,
    );
    const mapped_roles = plainToInstance(RoutesResponse, roles);
    const resp = this.OKResponse(mapped_roles);
    return resp;
  }

  @HttpCode(HttpStatus.OK)
  @Get('get/permission')
  async FindRoutePermissionsByID(
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    const route_permission = await this.routesService.FindRoutePermissionsByID(
      current_user,
    );
    const mapped_user = plainToInstance(
      RoutePermissionResponse,
      route_permission,
    );
    const resp = this.OKResponse(mapped_user);
    return resp;
  }
}
