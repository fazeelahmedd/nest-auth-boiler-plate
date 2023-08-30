/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MailService } from 'src/helpers/EmailHelper';
import { appEnv } from 'src/helpers/EnvHelper';
import { Hashpassword } from 'src/helpers/UtilHelper';
import { DataSource, In } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../base/base.service';
import { RoleRepository } from '../roles/role.repository';
import { UserRolesEntity } from '../user_role/entities/user.role.entity';
import { UserRoleRepository } from './../user_role/user.role.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { ModifyUserRolesRequest } from '../user_role/dto/modify-user-roles.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { UserEntity } from './entities/user.entity';
import { IRedisUserModel } from '../base/base.interface';
import { UserRepository } from './user.repository';
import { Request } from 'express';
import { MESSAGES, ResponseMessage } from 'src/common/messages';
import { ConfigService } from '@nestjs/config';
import { OTP_GENERATOR } from 'src/utils/otp-generator';
import { OtpEntity } from '../auth/entities/otp.entity';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';

const { SERVER_ERROR } = ResponseMessage;

@Injectable()
export class UserService extends BaseService<
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
  UserResponse
> {
  constructor(
    private userRoleRepository: UserRoleRepository,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    private mailService: MailService,
    private dataSource: DataSource,
    private configService: ConfigService,
    private jwtHelperService: JwtHelperService,
  ) {
    super(userRepository);
  }

  public async Create(
    body: CreateUserDto,
    req: Request,
  ): Promise<UserResponse> {
    let user_details: UserEntity;
    const { roles, ...user } = body;
    user.password = await Hashpassword(user.password);
    const map_user = plainToInstance(UserEntity, user);

    const query_runner = this.dataSource.createQueryRunner();
    await query_runner.connect();
    await query_runner.startTransaction();

    try {
      user_details = await query_runner.manager.save(map_user);
      const code = await this.authService.SendOtp(
        user_details.id,
        query_runner,
      );
      const roles_entities: UserRolesEntity[] = roles.map((role: any) => {
        const user_role = new UserRolesEntity();
        user_role.role_id = role;
        user_role.user_id = user_details.id;
        user_role.created_by = user_details.id;
        return user_role;
      });
      await query_runner.manager.save(roles_entities);

      let user_roles = await this.roleRepository.find({
        select: { name: true },
        where: { id: In(roles) },
      });
      user_roles = user_roles.map((role: any) => role.name);

      const replacements = {
        FullName: `${body.name}`,
        OTP: `${code}`,
      };

      const mail_options = {
        from: appEnv('SMTP_EMAIL'),
        to: body.email,
        subject: 'Verify Account',
      };

      await this.mailService.SendMail(
        'welcome.html',
        replacements,
        mail_options,
      );
      const resp: any = await plainToInstance(UserResponse, {
        ...user_details,
        user_roles,
      });
      await query_runner.commitTransaction();

      return resp;
    } catch (error) {
      await query_runner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException(SERVER_ERROR);
    } finally {
      await query_runner.release();
    }
  }
  async ModifyUserRoles(
    body: ModifyUserRolesRequest,
    user_id: number,
    current_user: IRedisUserModel,
  ): Promise<any> {
    try {
      const { added_roles, deleted_roles } = body;

      const delete_roles = this.userRoleRepository.softDelete({
        user_id,
        role_id: In(deleted_roles),
      });

      const user_roles: UserRolesEntity[] = added_roles.map((role) => {
        const user_role = new UserRolesEntity();
        user_role.role_id = +role;
        user_role.user_id = user_id;
        user_role.created_by = current_user.user_id;
        return user_role;
      });

      const add_roles = this.userRoleRepository.save(user_roles);
      await Promise.all([delete_roles, add_roles]);
      const response = await this.FindOne(user_id, ['user_roles']);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async Update(
    id: number,
    body: UpdateUserDto,
    req: Request,
    current_user?: IRedisUserModel,
  ): Promise<any> {
    try {
      let user;
      const { added_roles, deleted_roles } = body;
      const modifyroles = this.ModifyUserRoles(
        { added_roles, deleted_roles },
        id,
        current_user,
      );
      const item = await this.userRepository.findOneBy({ id });
      if (item) {
        user = this.userRepository.save({
          ...item,
          ...body,
        });
      }
      const [resp] = await Promise.all([modifyroles, user]);
      return resp;
    } catch (error) {
      throw error;
    }
  }
}
