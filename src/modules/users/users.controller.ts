import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ControllerFactory } from '../base/base.controller';
import { iResponseJson, IRedisUserModel } from '../base/base.interface';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { ModifyUserRolesRequest } from '../user_role/dto/modify-user-roles.dto';
@ApiTags('Users')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController extends ControllerFactory<
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
  UserResponse
>(UserEntity, CreateUserDto, UpdateUserDto, UserResponse) {
  constructor(protected userService: UserService) {
    super(userService);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  // @UsePipes(createPipe)
  async Create(
    @Body() body: CreateUserDto,
    @Req() req: Request,
    @CurrentUser() _current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    try {
      const response = await this.userService.Create({ ...body }, req);
      const mapped_resp = plainToInstance(UserResponse, response);
      const resp = this.CreatedResponse(mapped_resp);
      return resp;
    } catch (error) {
      throw error;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('get/:id')
  async GetOne(
    @Param('id') id: number,
    @Req() _req: Request,
    @CurrentUser() _current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    const user = await this.userService.FindOne(id, ['user_roles']);
    const mapped_user = plainToInstance(UserResponse, user);
    const resp = this.OKResponse(mapped_user);
    return resp;
  }

  @HttpCode(HttpStatus.OK)
  @Get('get')
  async Get(
    @Req() _req: Request,
    @CurrentUser() _current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    const users = await this.userService.Find(['user_roles']);
    const mapped_users = plainToInstance(UserResponse, users);
    const resp = this.OKResponse(mapped_users);
    return resp;
  }

  @HttpCode(HttpStatus.OK)
  @Patch('modify/roles/:id')
  async ModifyRoles(
    @Param('id') id: number,
    @Body() data: ModifyUserRolesRequest,
    @CurrentUser({ required: true })
    current_user: IRedisUserModel,
  ): Promise<iResponseJson> {
    const user = await this.userService.ModifyUserRoles(data, id, current_user);
    const mapped_user = plainToInstance(UserResponse, user);
    const resp = this.OKResponse(mapped_user);
    return resp;
  }
}
