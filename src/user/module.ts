import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService } from './services';
import { UserModuleConstants } from './constants';
import {
  ExerciseLogRepository,
  UserRepository,
  WeightLogRepository,
} from './repositories';
import { GreetUser } from './commands';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    GreetUser,
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
    {
      provide: UserModuleConstants.exerciseRepo,
      useClass: ExerciseLogRepository,
    },
    { provide: UserModuleConstants.weightRepo, useClass: WeightLogRepository },
  ],
  exports: [
    { provide: UserModuleConstants.userRepo, useClass: UserRepository },
  ],
})
export class UserModule {}
