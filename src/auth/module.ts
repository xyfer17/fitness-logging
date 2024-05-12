import { Logger, Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services';
import { AuthController } from './controllers';
import { UserModule } from '@app/user';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { RefreshTokenJwtStrategy } from './strategies/refreshJwtStrategy';
import { AccessTokenJwtStrategy } from './strategies/accessJwtStrategy';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    RefreshTokenJwtStrategy,
    AccessTokenJwtStrategy,
    Logger,
    Reflector,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
