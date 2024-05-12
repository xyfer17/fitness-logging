import { ExerciseLogModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface ExerciseLogRepositoryContract
  extends RepositoryContract<ExerciseLogModel> {}
