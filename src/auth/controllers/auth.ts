import { UserService } from '@app/user';
import {
  ApiResponse,
  Request,
  Response,
  ResponseUtility,
  RestController,
} from '@libs/boat';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AppConstants } from '@app/app.constant';
import { AccessTokenGuard, RefreshTokenGuard } from '../guards';

import { AuthModuleConstants } from '../constant';

import { __ } from '@squareboat/nestjs-localization';
import { AuthService } from '../services';
import { CreateUserDto, EmailDto, loginDto, resetPasswordDto } from '../dto';

@Controller('auth')
export class AuthController extends RestController {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Post('register')
  async registerViaEmail(@Body() body: CreateUserDto): Promise<ApiResponse> {
    const { email, password, roleType } = body;

    await this.authService.userRegistration(email, password, roleType);

    return ResponseUtility.sendSuccessMessage(
      AppConstants.USER_REGISTERED_SUCCESSFULLY,
      HttpStatus.CREATED,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: loginDto): Promise<ApiResponse> {
    const response = await this.authService.validateUserByPassword(body);
    const { accessToken, refreshToken } = response;

    return ResponseUtility.sendSuccessResponse({
      accessToken,
      refreshToken,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logoutUser(@Req() req: Request): Promise<ApiResponse> {
    const { user } = req;

    await this.authService.logoutUser(user.id);
    return ResponseUtility.sendSuccessMessage('logout successfully.');
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req: Request): Promise<ApiResponse> {
    const { user } = req;
    const authToken = await this.authService.refreshToken(user);

    return ResponseUtility.sendSuccessResponse({
      accessToken: authToken.accessToken,
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: EmailDto): Promise<ApiResponse> {
    const token = await this.authService.ForgotPassword(body.email);
    return ResponseUtility.sendSuccessResponse({
      ForgotPasswordToken: token,
    });
  }

  @Post('reset-password/:token')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Req() req: Request,
    @Body() body: resetPasswordDto,
  ): Promise<ApiResponse> {
    await this.authService.resetPassword(req.params.token, body);
    return ResponseUtility.sendSuccessMessage(
      AuthModuleConstants.UPDATE_PASSWORD,
    );
  }

  @Post('send-verification-email')
  async sendVerificationEmail(
    @Body() body: EmailDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { email } = body;
    const isEmailSent = await this.authService.resendEmailVerification(email);
    if (isEmailSent) {
      return res.json({
        success: true,
        code: HttpStatus.OK,
        message: AppConstants.MAIL_SENT_SUCCESSFULLY,
      });
    } else {
      return res.error(AppConstants.MAIL_NOT_SENT);
    }
  }

  @Get('verify-email/:token')
  async verifyToken(@Req() req: Request) {
    const result = await this.authService.verifyEmail(req.params.token);
    return result;
  }
}
