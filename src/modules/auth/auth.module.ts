import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/modules/users/users.module';
import { UserEntity } from '../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { MailService } from 'src/helpers/EmailHelper';
import { JwtService } from '@nestjs/jwt';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { RefreshStrategy } from 'src/strategies/refresh.strategy';
import { CacheService } from 'src/helpers/CacheService';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    MailService,
    JwtService,
    JwtHelperService,
    JwtStrategy,
    RefreshStrategy,
    CacheService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
