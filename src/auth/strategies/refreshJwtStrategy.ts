import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth';
import { ConfigService } from '@nestjs/config';
import { AppConstants } from '@app/app.constant';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('services.auth.refresh_token_secret'),
      passReqToCallback: true,
    });
  }
  async validate(req: any, payload: any) {
    const refreshToken = req?.headers.authorization.replace('Bearer ', '');
    if (!refreshToken) {
      throw new UnauthorizedException();
    }
    const user = await this.authService.validateJwtPayload(payload);
    if (!user) {
      throw new UnauthorizedException();
    }

    const lastLoginTimestamp = user.updatedAt?.toString();
    if (lastLoginTimestamp !== payload.timestamp) {
      throw new UnauthorizedException(AppConstants.TOKEN_EXPIRED);
    }
    return { ...user, refreshToken };
  }
}
