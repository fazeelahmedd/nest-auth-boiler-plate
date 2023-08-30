import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { ResponseController } from '../base/response.controller';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { IRedisUserModel, iResponseJson } from '../base/base.interface';
import { AuthResendVerificationEmailDto } from './dto/auth-resend-verification-email.dto';
import { Request, Response } from 'express';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthRefreshTokenDto } from './dto/auth-refresh-token.dto';
import { Public } from 'src/decorators/public.decorator';
import { RefreshAuthGuard } from 'src/guards/refresh-auth.guard';
import { AuthRequest, JwtOtpPayload } from './auth.interface';
import { AuthChangePasswordDto } from './dto/change-password-dto';
import { ChangePasswordInterceptor } from 'src/utils/change.password.interceptor';
import { MESSAGES } from 'src/common/messages';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { UserResponse } from '../users/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

const {
  AUTH: {
    SUCCESS: { PASSWORD_CHANGED, ACCOUNT_VERIFIED, VERIFICATION_EMAIL_SENT },
  },
} = MESSAGES;
@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController extends ResponseController {
  constructor(public authService: AuthService) {
    super();
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async Login(@Body() data: AuthEmailLoginDto): Promise<iResponseJson> {
    try {
      const user_info = await this.authService.Login(data);
      return this.OKResponse(user_info);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Put('/verify/email')
  async VerifyEmail(
    @Query('user_id') user_id: number,
    @Query('otp') otp: string,
  ): Promise<iResponseJson> {
    try {
      await this.authService.VerifyEmail(user_id, otp);
      return this.OKResponse({}, ACCOUNT_VERIFIED);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/resend/verification/email')
  async ResendVerificationEmail(
    @Body() data: AuthResendVerificationEmailDto,
    @Req() req: Request,
  ): Promise<iResponseJson> {
    try {
      await this.authService.ResendVerificationEmail(req, data);
      return this.OKResponse({}, VERIFICATION_EMAIL_SENT);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/resend/otp')
  async ResendOtp(@Query('user_id') user_id: number): Promise<iResponseJson> {
    try {
      const otp_token = await this.authService.ResendOtp(user_id);
      return this.OKResponse(otp_token);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/forgot/password')
  async ForgotPassword(
    @Body() data: AuthForgotPasswordDto,
    @Req() req: Request,
  ): Promise<iResponseJson> {
    try {
      await this.authService.ForgotPassword(req, data);
      return this.OKResponse(null);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/verify/reset/password/request')
  async VerifyResetPasswordRequest(
    @Query('user_id') user_id: number,
    @Query('code') code: string,
  ) {
    try {
      const verification = await this.authService.VerifyResetPasswordRequest(
        user_id,
        code,
      );
      return verification;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @Post('/reset/password')
  async ResetPassword(
    @Body() data: AuthResetPasswordDto,
    @Query('user_id') user_id: number,
  ): Promise<iResponseJson> {
    try {
      await this.authService.ResetPassword(data, user_id);
      return this.OKResponse({}, PASSWORD_CHANGED);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('/refresh/token')
  async RefreshToken(@Req() req: AuthRequest): Promise<iResponseJson> {
    try {
      const {
        user: { refresh_token },
      } = req;
      const tokens = await this.authService.RefreshToken(refresh_token);
      return this.OKResponse(tokens);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('/change/password')
  async ChangePassword(
    @Body() data: AuthChangePasswordDto,
  ): Promise<iResponseJson> {
    try {
      await this.authService.ChangePassword(data);
      return this.OKResponse(this.OKResponse);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  @Get('/me')
  async Me(
    @CurrentUser({ required: true })
    user: IRedisUserModel,
  ): Promise<iResponseJson> {
    const user_details = await this.authService.GetUser(user.user_id);
    return this.OKResponse(user_details);
  }
}
