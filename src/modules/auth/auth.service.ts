import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { decode, sign, verify } from 'jsonwebtoken';
import { MailService } from 'src/helpers/EmailHelper';
import { appEnv } from 'src/helpers/EnvHelper';
import { Comparepassword, Hashpassword } from 'src/helpers/UtilHelper';
import { UserRepository } from '../users/user.repository';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthResendVerificationEmailDto } from './dto/auth-resend-verification-email.dto';
import { Request, Response } from 'express';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtHelperService } from 'src/helpers/jwt-helper.service';
import { MESSAGES } from 'src/common/messages';
import { AuthChangePasswordDto } from './dto/change-password-dto';
import { UserService } from '../users/users.service';
import { DataSource, QueryRunner } from 'typeorm';
import { OtpEntity } from './entities/otp.entity';
import { OTP_GENERATOR } from 'src/utils/otp-generator';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '../users/entities/user.entity';
import { JwtOtpPayload } from './auth.interface';

const {
  AUTH: {
    ERROR: {
      USERNAME_PASSWORD_INCORRECT,
      EMAIL_UNVERIFIED,
      USER_DISABLED,
      USER_NOT_ACTIVE,
      VERIFICATION_LINK_EXPIRED,
      USER_ALREADY_VERIFIED,
      USER_NOT_EXIST,
    },
    SUCCESS: { VERIFY_EMAIL },
  },
  USER: {
    ERROR: { USER_DOES_NOT_EXIST },
  },
  OTP: {
    ERROR: { OTP_EXPIRED, OTP_INVALID },
  },
} = MESSAGES;

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private jwtHelperService: JwtHelperService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private dataSource: DataSource,
  ) {}

  public async Login(data: AuthEmailLoginDto): Promise<{
    user: any;
    access_token: string;
    refresh_token: string;
  }> {
    try {
      const users: any = await this.userRepository.FindUserWithRoleAndPassword(
        data,
      );

      if (!users) {
        throw new BadRequestException(USERNAME_PASSWORD_INCORRECT);
      } else if (!users.is_verified) {
        throw new NotAcceptableException(EMAIL_UNVERIFIED);
      } else if (!users.is_enabled) {
        throw new NotAcceptableException(USER_DISABLED);
      } else if (!users.is_active) {
        throw new NotAcceptableException(USER_NOT_ACTIVE);
      }

      const password_is_valid = await Comparepassword(
        data.password,
        users.password,
      );
      users.login_flag = true;
      const flag_promise = this.userRepository.save(users);

      delete users['password'];
      if (!password_is_valid) {
        throw new BadRequestException(USERNAME_PASSWORD_INCORRECT);
      }
      const payload = {
        user_id: users.id,
        roles: users.roles,
        role_ids: users.role_ids,
      };
      const access_promise = this.jwtHelperService.SignAccessToken(payload);
      const refresh_promise = this.jwtHelperService.SignRefreshToken(payload);
      const [access_token, refresh_token] = await Promise.all([
        access_promise,
        refresh_promise,
        flag_promise,
      ]);
      return { user: users, access_token, refresh_token };
    } catch (error) {
      throw error;
    }
  }

  public async VerifyEmail(user_id: number, otp: string): Promise<any> {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const user = await query_runner.manager.findOneBy(OtpEntity, {
        user_id,
      });
      if (!user) {
        throw new NotFoundException(USER_NOT_EXIST);
      }
      if (user.code !== otp) {
        throw new BadRequestException(OTP_INVALID);
      }
      const date = new Date();
      if (user.expiry_time < date) {
        throw new BadRequestException(OTP_EXPIRED);
      }
      const user_details = await query_runner.manager.findOneBy(UserEntity, {
        id: user_id,
      });
      if (user_details.is_verified == true) {
        throw new BadRequestException(USER_ALREADY_VERIFIED);
      }
      const mapped_user = plainToInstance(UserEntity, { is_verified: true });
      const mapped_otp = plainToInstance(OtpEntity, { is_used: true });
      const user_verified_promise = query_runner.manager.save(UserEntity, {
        ...user_details,
        ...mapped_user,
      });
      const otp_used_promise = query_runner.manager.save(OtpEntity, {
        ...user,
        ...mapped_otp,
      });
      const [user_verified, otp_used] = await Promise.all([
        user_verified_promise,
        otp_used_promise,
      ]);
      await query_runner.commitTransaction();
      return { message: VERIFY_EMAIL };
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }

  public CreateFPToken(user: any) {
    return sign({ id: user.id, email: user.email }, appEnv('FPTOKEN_SECRET'), {
      expiresIn: '72h',
    });
  }

  protected async VerifyFPToken(token: string) {
    let user_details: any;
    try {
      user_details = await verify(token, appEnv('FPTOKEN_SECRET'));
    } catch (err) {
      throw new ForbiddenException(VERIFICATION_LINK_EXPIRED);
    }

    return user_details;
  }

  public async ResendVerificationEmail(
    req: Request,
    data: AuthResendVerificationEmailDto,
  ): Promise<null> {
    try {
      const user = await this.userRepository.findOneBy({
        id: data.user_id,
      });
      if (!user) {
        throw new ForbiddenException(USER_NOT_EXIST);
      }

      const code = await this.ResendOtp(data.user_id);

      const replacements = {
        FullName: `${user.name}`,
        OTP: `${code}`,
      };

      const mail_options = {
        from: appEnv('SMTP_EMAIL'),
        to: user.email,
        subject: 'Verify Account',
      };

      await this.mailService.SendMail(
        'welcome.html',
        replacements,
        mail_options,
      );

      return null;
    } catch (error) {
      throw error;
    }
  }

  public async ForgotPassword(
    req: Request,
    data: AuthForgotPasswordDto,
  ): Promise<any> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    const code = await this.ResendOtp(user.id);
    if (!user) {
      throw new ForbiddenException(USER_NOT_EXIST);
    }

    const replacements = {
      FullName: `${user.name}`,
      ResetPasswordOtp: code,
    };

    const mail_options = {
      from: appEnv('SMTP_EMAIL'),
      to: data.email,
      subject: 'Reset Password',
    };

    await this.mailService.SendMail(
      'reset-password.html',
      replacements,
      mail_options,
    );

    return null;
  }

  public async VerifyResetPasswordRequest(user_id, code) {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      const user = await this.userRepository.findOneBy({ id: user_id });
      if (!user) {
        throw new NotFoundException(USER_NOT_EXIST);
      }
      const user_otp = await query_runner.manager.findOneBy(OtpEntity, {
        user_id,
      });
      const date = new Date();
      if (user_otp.expiry_time < date) {
        throw new BadRequestException(OTP_EXPIRED);
      }
      if (!user_otp || user_otp.code !== code) {
        throw new BadRequestException(OTP_INVALID);
      }
      return { verified: true };
    } catch (error) {
      throw error;
    }
  }

  public async ResetPassword(
    data: AuthResetPasswordDto,
    user_id: number,
  ): Promise<any> {
    try {
      const user = await this.userRepository.findOneBy({ id: user_id });
      if (!user) throw new ForbiddenException(USER_DOES_NOT_EXIST);
      user.password = await Hashpassword(data.password);
      await this.userRepository.save(user);
      return { message: 'Successful' };
    } catch (error) {
      throw error;
    }
  }

  public async RefreshToken(refresh_token: string): Promise<any> {
    try {
      const { user_id, role, role_id } =
        await this.jwtHelperService.VerifyRefreshToken(refresh_token);

      const access_token = await this.jwtHelperService.SignAccessToken({
        user_id,
        roles: role,
        role_ids: role_id,
      });
      const ref_token = await this.jwtHelperService.SignRefreshToken({
        user_id,
        roles: role,
        role_ids: role_id,
      });
      return { access_token, refresh_token: ref_token };
    } catch (error) {
      throw error;
    }
  }

  public async ChangePassword(data: AuthChangePasswordDto): Promise<void> {
    try {
      const { password, ...new_data } = data;
      const user: any = await this.userRepository.FindUserWithRoleAndPassword(
        new_data,
      );

      if (!user) {
        throw new ForbiddenException(MESSAGES.AUTH.ERROR.USER_NOT_EXIST);
      }

      const password_is_valid = await Comparepassword(password, user.password);
      delete user['password'];
      if (!password_is_valid) {
        throw new BadRequestException(USERNAME_PASSWORD_INCORRECT);
      }

      user.password = await Hashpassword(data.password);
      await this.userRepository.save(user);
      return null;
    } catch (error) {
      throw error;
    }
  }

  public async GetUser(user_id: number): Promise<any> {
    const user = await this.userService.FindOne(user_id, ['user_roles']);
    if (!user) {
      throw new NotFoundException(USER_DOES_NOT_EXIST);
    }
    return user;
  }

  public async SendOtp(
    user_id: number,
    query_runner?: QueryRunner,
  ): Promise<any> {
    try {
      const code = OTP_GENERATOR();
      const time = this.configService.get('OTP_EXPIRY_TIME');
      const expiry_time = new Date(Date.now() + time * 60 * 1000);
      const otp = {
        code,
        expiry_time,
        user_id,
      };

      const mapped_otp = plainToInstance(OtpEntity, otp);
      await query_runner.manager.save(mapped_otp);
      return code;
    } catch (error) {
      throw error;
    }
  }

  public async ResendOtp(user_id: number): Promise<any> {
    const query_runner = this.dataSource.createQueryRunner();
    try {
      await query_runner.startTransaction();
      const user_otp = await query_runner.manager.findOneBy(OtpEntity, {
        user_id,
      });
      if (user_otp) {
        await query_runner.manager.softRemove(user_otp);
      }
      const code = OTP_GENERATOR();
      const time = this.configService.get('OTP_EXPIRY_TIME');
      const expiry_time = new Date(Date.now() + time * 60 * 1000);
      const otp = {
        code,
        expiry_time,
        user_id,
      };

      const mapped_otp = plainToInstance(OtpEntity, otp);
      await query_runner.manager.save(mapped_otp);
      await query_runner.commitTransaction();
      return code;
    } catch (error) {
      await query_runner.rollbackTransaction();
      throw error;
    } finally {
      await query_runner.release();
    }
  }
}
