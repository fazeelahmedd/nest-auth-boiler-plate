import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { RoleRepository } from '../roles/role.repository';
import { RoleEntity } from '../roles/entities/role.entity';
import { UserRolesEntity } from '../user_role/entities/user.role.entity';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { IsMultipleExist } from 'src/utils/validators/is-multiple-exist.validator';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { UserRoleRepository } from '../user_role/user.role.repository';
import { AuthService } from '../auth/auth.service';
import { MailService } from 'src/helpers/EmailHelper';
import { JwtService } from '@nestjs/jwt';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UserEntity, RoleEntity, UserRolesEntity]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    UserEntity,
    RoleRepository,
    UserRoleRepository,
    IsNotExist,
    IsMultipleExist,
    IsExist,
    AuthService,
    MailService,
    JwtService,
    JwtHelperService,
  ],
  exports: [
    UserService,
    UserRepository,
    RoleRepository,
    UserEntity,
    UserModule,
  ],
})
export class UserModule {}
