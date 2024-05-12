import { Module } from '@nestjs/common';
import { UserModule } from './user';
import { BoatModule } from '@libs/boat';
import { ConsoleModule } from '@squareboat/nest-console';
import { ObjectionModule } from '@squareboat/nestjs-objection';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalizationModule } from '@squareboat/nestjs-localization';
import { AuthModule } from './auth';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ObjectionModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('db'),
      inject: [ConfigService],
    }),
    LocalizationModule.register({
      path: 'resources/lang',
      fallbackLang: 'en',
    }),
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
    }),
    ConsoleModule,
    BoatModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
