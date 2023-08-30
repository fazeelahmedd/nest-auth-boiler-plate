import { CacheModule, Module } from '@nestjs/common';
import { UserModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { RoleModule } from './modules/roles/role.module';
import databaseConfig from './config/database.config';
import { DataSource } from 'typeorm';
import { AuthService } from './modules/auth/auth.service';
import { MailService } from './helpers/EmailHelper';
import { JwtService } from '@nestjs/jwt';
import { JwtHelperService } from './helpers/jwt-helper.service';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoutesModule } from './modules/routes/routes.module';
import { CacheConfigService } from './cache/cache-config.service';
import cacheConfig from './config/cache.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useClass: CacheConfigService,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, cacheConfig, appConfig],
      envFilePath: ['.env.example'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const data_source = await new DataSource(options).initialize();
        return data_source;
      },
    }),
    UserModule,
    RoleModule,
    AuthModule,
    RoutesModule,
  ],
  providers: [
    AuthService,
    MailService,
    JwtService,
    JwtHelperService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
