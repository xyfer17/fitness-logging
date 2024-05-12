import { ExerciseLogModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { ExerciseLogRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class ExerciseLogRepository
  extends DatabaseRepository<ExerciseLogModel>
  implements ExerciseLogRepositoryContract
{
  @InjectModel(ExerciseLogModel)
  model: ExerciseLogModel;
}
