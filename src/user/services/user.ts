import { Injectable, Inject } from '@nestjs/common';
import {
  ExerciseLogRepositoryContract,
  WeightLogRepositoryContract,
} from '../repositories';
import { UserModuleConstants } from '../constants';
import { ExerciseDto, WeightDto } from '../dto';
import { ExerciseLogModel, WeightLogModel } from '../models';

@Injectable()
export class UserService {
  constructor(
    @Inject(UserModuleConstants.exerciseRepo)
    private exerciseLog: ExerciseLogRepositoryContract,
    @Inject(UserModuleConstants.weightRepo)
    private weightLog: WeightLogRepositoryContract,
  ) {}

  async createExerciseLog(
    logDetails: ExerciseDto,
    userId: number,
  ): Promise<ExerciseLogModel> {
    const exerciseLog = await this.exerciseLog.create({
      ...logDetails,
      userId,
    });
    return exerciseLog;
  }

  async createWeightLog(
    logDetails: WeightDto,
    userId: number,
  ): Promise<WeightLogModel> {
    const weightLog = await this.weightLog.create({
      ...logDetails,
      userId,
    });
    return weightLog;
  }
}
