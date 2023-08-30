/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ArgumentMetadata,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  Param,
  Post,
  Put,
  Req,
  Type,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToInstance, Transform } from 'class-transformer';
import { BaseService } from './base.service';
import { ResponseController } from './response.controller';
import { Request } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { iResponseJson } from 'src/modules/base/base.interface';
import { IRedisUserModel } from '../base/base.interface';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import { ApiBody } from '@nestjs/swagger';

export type ClassType<T> = new (...args: any[]) => T;

export interface ICrudController<EntityType, CreateDto, UpdateDto, responseDto>
  extends ResponseController {
  Create(
    body: CreateDto,
    req: Request,
    current_user: IRedisUserModel,
  ): Promise<iResponseJson>;

  GetOne(
    id: number,
    req: Request,
    current_user: IRedisUserModel,
  ): Promise<iResponseJson>;

  Get(req: Request, current_user: IRedisUserModel): Promise<iResponseJson>;

  Update(
    body: UpdateDto,
    id: number,
    req: Request,
    current_user: IRedisUserModel,
  ): Promise<iResponseJson>;

  Delete(
    id: number,
    req: Request,
    current_user: IRedisUserModel,
  ): Promise<iResponseJson>;
}

@Injectable()
export class AbstractValidationPipe extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: { body?: Type; query?: Type; param?: Type },
  ) {
    super(options);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async transform(value: any, metadata: ArgumentMetadata) {
    const target_type = this.targetTypes[metadata.type];
    if (!target_type) {
      return super.transform(value, metadata);
    }
    return super.transform(value, { ...metadata, metatype: target_type });
  }
}

@Injectable()
export class ParamValidationPipe<T> extends ValidationPipe {
  constructor(
    options: ValidationPipeOptions,
    private readonly targetTypes: {
      body?: Type<T>;
      query?: Type<T>;
      param?: Type<T>;
    },
  ) {
    super(options);
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  async transform(value: any, metadata: ArgumentMetadata) {
    const target_type: ClassType<T> = this.targetTypes[metadata.type];
    if (!target_type) {
      return super.transform(value, metadata);
    }
    const output = await super.transform(
      { id: value },
      { ...metadata, type: 'param', metatype: target_type },
    );
    return output.id;
  }
}

const param_factory = (entity: EntityClassOrSchema) => {
  @UseInterceptors(ClassSerializerInterceptor)
  class ParamDto {
    @Validate(IsExist, [entity, 'id'], {
      message: (validationArgs) => {
        return `${
          typeof validationArgs.constraints[0] === 'string'
            ? validationArgs.constraints[0]
            : 'Resource'
        } with the id of ${validationArgs.value} doesn't exists`;
      },
    })
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value))
    id: number;
  }
  return ParamDto;
};

export function ControllerFactory<T, C, U, R>(
  entity: EntityClassOrSchema,
  createDto: Type<C>,
  updateDto: Type<U>,
  responseDto: Type<R>,
  // queryDto: Type<G>,
): ClassType<ICrudController<T, C, U, R>> {
  const create_pipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: createDto },
  );
  const update_pipe = new AbstractValidationPipe(
    { whitelist: true, transform: true },
    { body: updateDto },
  );

  const param_pipe = new ParamValidationPipe(
    { whitelist: true, transform: true },
    { param: param_factory(entity) },
  );

  @Controller()
  @UsePipes(param_pipe)
  @UseInterceptors(ClassSerializerInterceptor)
  class CrudController<T, C, U, R>
    extends ResponseController
    implements ICrudController<T, C, U, R>
  {
    constructor(private baseService: BaseService<T, C, U, R>) {
      super();
    }

    @ApiBody({ type: createDto })
    @HttpCode(HttpStatus.CREATED)
    @Post('create')
    @UsePipes(create_pipe)
    async Create(
      @Body() body: C,
      @Req() req: Request,
      @CurrentUser() current_user: IRedisUserModel,
    ): Promise<iResponseJson> {
      try {
        const response = await this.baseService.Create({ ...body }, req);
        const mapped_resp = plainToInstance(responseDto, response);
        const resp = this.CreatedResponse(mapped_resp);
        return resp;
      } catch (error) {
        throw error;
      }
    }

    @HttpCode(HttpStatus.OK)
    @Get('get')
    async Get(
      @Req() req: Request,
      @CurrentUser() current_user: IRedisUserModel,
    ): Promise<iResponseJson> {
      try {
        const response = await this.baseService.Find();
        const mapped_resp = plainToInstance(responseDto, response);
        const resp = this.OKResponse(mapped_resp);
        return resp;
      } catch (error) {
        throw error;
      }
    }

    @HttpCode(HttpStatus.OK)
    @Get('get/:id')
    async GetOne(
      @Param('id') id: number,
      @Req() req: Request,
      @CurrentUser() current_user: IRedisUserModel,
    ): Promise<iResponseJson> {
      try {
        const response = await this.baseService.FindOne(id);
        const mapped_resp = plainToInstance(responseDto, response);
        const resp = this.OKResponse(mapped_resp);
        return resp;
      } catch (error) {
        throw error;
      }
    }

    @ApiBody({ type: updateDto })
    @HttpCode(HttpStatus.OK)
    @Put('update/:id')
    @UsePipes(update_pipe)
    async Update(
      @Body() body: U,
      @Param('id') id: number,
      @Req() req: Request,
      @CurrentUser() current_user: IRedisUserModel,
    ): Promise<iResponseJson> {
      try {
        const response = await this.baseService.Update(
          id,
          body,
          req,
          current_user,
        );
        const mapped_resp = plainToInstance(responseDto, response);
        const resp = this.OKResponse(mapped_resp);
        return resp;
      } catch (error) {
        throw error;
      }
    }

    @HttpCode(HttpStatus.OK)
    @Delete('delete/:id')
    async Delete(
      @Param('id') id: number,
      @Req() req: Request,
      @CurrentUser() current_user: IRedisUserModel,
    ): Promise<iResponseJson> {
      try {
        await this.baseService.Delete(id);
        const resp = this.OKResponse({});
        return resp;
      } catch (error) {
        throw error;
      }
    }
  }

  return CrudController;
}
