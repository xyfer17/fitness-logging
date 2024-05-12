import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth';
import { ConfigService } from '@nestjs/config';
import { AppConstants } from '@app/app.constant';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('services.auth.access_token_secret'),
    });
  }
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateJwtPayload(payload);
    if (!user || user.roleType !== 'user') {
      throw new UnauthorizedException();
    }
    const lastLoginTimestamp = user.lastLoginAt?.toString();
        if (lastLoginTimestamp !== payload.timestamp) {
            throw new UnauthorizedException(AppConstants.TOKEN_EXPIRED);
        }
    return user;
  }
}
