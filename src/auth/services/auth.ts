import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModuleConstants } from '@app/user/constants';
import { UserRepositoryContract } from '@app/user/repositories';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { AppConstants } from '@app/app.constant';
import { UserModel } from '@app/user';
import { ValidationFailed } from '@libs/boat';
import { loginDto } from '../dto/login.dto';
import { resetPasswordDto } from '../dto';
import { __ } from '@squareboat/nestjs-localization';
import { Role } from '../enum/role.enum';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserModuleConstants.userRepo) private users: UserRepositoryContract,
    private config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
  ) {}

  protected logger = new Logger(AuthService.name);

  async userRegistration(
    email: string,
    password: string,
    roleType: Role,
  ): Promise<void> {
    const normalizedEmail = email.toLowerCase();
    const user = await this.users.firstWhere({ email: normalizedEmail }, false);

    if (user) {
      throw new ConflictException(AppConstants.USER_ALREADY_REGISTERED);
    }

    const isAdmin = roleType === Role.Admin ? true : false;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await this.users.create({
      email: email,
      password: hashPassword,
      roleType,
      isAdmin,
    });
  }

  async createToken(
    user: UserModel,
    timestamp: Date,
  ): Promise<Record<string, any>> {
    const data: JwtPayload = {
      userId: user.id,
      email: user.email,
      roleType: user.roleType,
      timestamp: timestamp.toString(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(data, {
        secret: this.config.get('services.auth.access_token_secret'),
        expiresIn: '1d',
      }),
      this.jwtService.signAsync(data, {
        secret: this.config.get('services.auth.refresh_token_secret'),
        expiresIn: '7d',
      }),
    ]);

    return {
      ...data,
      accessToken,
      refreshToken,
    };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<Record<string, any>> {
    const data = await this.users.firstWhere({ id: payload.userId }, false);
    if (!data) {
      throw new NotFoundException(AppConstants.USER_NOT_FOUND);
    }
    delete data.password;
    return data;
  }

  async validateUserByPassword(payload: loginDto) {
    const { email, password } = payload;
    const lowercasedEmail = email.toLowerCase();
    const user = await this.users.firstWhere({ email: lowercasedEmail }, false);
    const now = new Date();

    if (!user) {
      throw new NotFoundException(AppConstants.NOT_REGISTERED);
    }

    if (!user?.emailVerifiedAt) {
      throw new UnauthorizedException(AppConstants.USER_NOT_VERIFIED);
    }

    const isMatch = await this.comparePassword(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException(AppConstants.INVALID_LOGIN_CREDENTIAL);
    }

    const tokens = await this.createToken(user, now);
    await this.updateRefreshTokenById(user.id, tokens.refreshToken);
    await this.users.update(user, { lastLoginAt: now, updatedAt: now });

    return tokens;
  }

  async refreshToken(user): Promise<Record<string, any>> {
    const { refreshToken, email } = user;

    const now = new Date();

    const userData = await this.users.firstWhere({ email }, false);

    if (!userData) {
      throw new ForbiddenException(AppConstants.USER_NOT_FOUND);
    }

    if (!userData.refreshToken) {
      throw new ForbiddenException(AppConstants.INVALID_REFRESH_TOKEN);
    }

    const isMatchFound = await bcrypt.compare(
      refreshToken,
      userData.refreshToken,
    );

    if (!isMatchFound) {
      throw new ForbiddenException(AppConstants.INVALID_REFRESH_TOKEN);
    }

    const tokens = await this.createToken(user, now);
    await this.users.update(userData, { lastLoginAt: now });
    return tokens;
  }

  async sendEmailVerification(email: string): Promise<boolean> {
    try {
      const user = await this.users.firstWhere({ email }, false);
      const now = new Date();
      if (!user) {
        throw new HttpException(
          AppConstants.NOT_REGISTERED,
          HttpStatus.BAD_REQUEST,
        );
      }
      const token = await this.createEmailToken(
        user.id,
        user.email,
        now.toString(),
      );
      const verificationUrl = `${this.config.get(
        'services.verificaiton_url',
      )}/${token}`;

      await this.sendMail(email, verificationUrl);

      await this.users.update(user, { lastSendMail: now });

      return true;
    } catch (error) {
      this.logger.error(error);
      return false;
    }
  }

  async createEmailToken(
    userId: number | string,
    emailId: string,
    timestamp: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      { emailId, userId, timestamp },
      {
        secret: this.config.get<string>('services.mail_secret'),
        expiresIn: '15m',
      },
    );
    return token;
  }

  async verifyEmail(token: string): Promise<Record<string, any>> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('services.mail_secret'),
      });

      if (payload && payload.userId) {
        const user = await this.users.firstWhere({ id: payload.userId });
        if (
          user.lastSendMail &&
          user.lastSendMail.toString() !== payload.timestamp
        ) {
          throw new HttpException(
            AppConstants.TOKEN_EXPIRED,
            HttpStatus.FORBIDDEN,
          );
        }
        if (user.emailVerifiedAt) {
          throw new HttpException(
            AppConstants.USER_ALREADY_VERIFIED,
            HttpStatus.FORBIDDEN,
          );
        } else {
          await this.users.update(user, {
            emailVerifiedAt: new Date(),
            status: 'active',
          });
        }
      }
      return { success: true, message: 'Verified Successfully' };
    } catch (error) {
      this.logger.log(error);
      return { success: false, message: error.message };
    }
  }

  async setPassword(
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<void> {
    // Lowercase the email if it is not already lowercase
    const normalizedEmail = email.toLowerCase();

    const user = await this.users.firstWhere({ email: normalizedEmail }, false);

    if (!user) {
      throw new HttpException(
        AppConstants.NOT_REGISTERED,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.emailVerifiedAt) {
      if (password !== confirmPassword) {
        throw new ValidationFailed({
          confirmPassword: ['Password Mismatch'],
        });
      }

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      await this.users.update(user, { password: hashPassword });
    } else {
      throw new HttpException(
        AppConstants.USER_NOT_VERIFIED,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async resendEmailVerification(email: string): Promise<boolean> {
    email = email.toLowerCase();
    const user = await this.users.firstWhere({ email }, false);

    if (!user) {
      throw new HttpException(
        AppConstants.NOT_REGISTERED,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.emailVerifiedAt) {
      throw new HttpException(
        AppConstants.USER_ALREADY_VERIFIED,
        HttpStatus.FORBIDDEN,
      );
    }

    const isEmailSent = await this.sendEmailVerification(user.email);
    return isEmailSent;
  }

  async updateRefreshTokenById(id: number, refToken: string) {
    if (!refToken) {
      const user = await this.users.firstWhere({ id });
      return await this.users.update(user, { refreshToken: null });
    }
    const hashedToken = await this.hashData(refToken);
    const user = await this.users.firstWhere({ id });
    return await this.users.update(user, { refreshToken: hashedToken });
  }

  private hashData(token: string) {
    return bcrypt.hash(token, 10);
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  async ResetPasswordToken(
    userId: number | string,
    email: string,
    timestamp: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      { email, userId, timestamp },
      {
        secret: this.config.get<string>('settings.reset_password_secret'),
        expiresIn: '15m',
      },
    );
    return token;
  }

  async ForgotPassword(email: string) {
    const user = await this.users.firstWhere(
      { email, roleType: 'user' },
      false,
    );

    if (!user) {
      throw new HttpException(
        __('auth.NOT_REGISTERED_EMAIL', 'en'),
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user && !user.emailVerifiedAt) {
      throw new HttpException(
        AppConstants.USER_NOT_VERIFIED,
        HttpStatus.FORBIDDEN,
      );
    }

    const now = new Date();
    const token = await this.ResetPasswordToken(
      user.id,
      user.email,
      now.toString(),
    );

    await this.users.update(user, {
      passwordResetTimestamp: now,
      resetPasswordStatus: false,
    });

    return token;
  }

  async verifyResetToken(token: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get<string>('settings.reset_password_secret'),
      });

      const user = await this.users.firstWhere({ id: payload.userId });

      if (
        !user.passwordResetTimestamp ||
        user.passwordResetTimestamp.toString() !== payload.timestamp
      ) {
        throw new HttpException(
          AppConstants.TOKEN_EXPIRED,
          HttpStatus.FORBIDDEN,
        );
      }

      if (user && user.resetPasswordStatus) {
        throw new HttpException(
          AppConstants.USER_ALREADY_VERIFIED,
          HttpStatus.FORBIDDEN,
        );
      }

      await this.users.update(user, { resetPasswordStatus: true });

      return true;
    } catch (error) {
      this.handleTokenVerificationError(error);
    }
  }

  async resetPassword(token: string, data: resetPasswordDto): Promise<void> {
    const { email, password, confirmPassword } = data;

    const user = await this.users.firstWhere(
      { email: email.toLowerCase() },
      false,
    );
    if (!user) {
      throw new HttpException(
        __('auth.NOT_REGISTERED_EMAIL', 'en'),
        HttpStatus.BAD_REQUEST,
      );
    }
    const verified = await this.verifyResetToken(token);

    if (!verified) throw new ForbiddenException(AppConstants.USER_NOT_VERIFIED);
    await this.setPassword(email, password, confirmPassword);

    await this.users.update(user, {
      passwordResetTimestamp: null,
      resetPasswordStatus: false,
      refreshToken: null,
    });
  }

  async logoutUser(userId: number): Promise<void> {
    const now = new Date();
    await this.users.updateWhere(
      { id: userId },
      { lastLoginAt: now, refreshToken: null },
    );
  }

  async sendMail(email: string, verificationUrl: string) {
    const message = `Click on the link to verify email address : ${verificationUrl} `;

    this.mailService.sendMail({
      to: email,
      subject: `Email Verification`,
      text: message,
    });
  }

  private handleTokenVerificationError(error: any): void {
    this.logger.log(error);

    if (error.message === 'jwt expired') {
      throw new HttpException(AppConstants.TOKEN_EXPIRED, HttpStatus.FORBIDDEN);
    }

    throw new HttpException(error.message, HttpStatus.FORBIDDEN);
  }
}
