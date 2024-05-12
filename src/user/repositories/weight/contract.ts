import { WeightLogModel } from '@app/user/models';
import { RepositoryContract } from '@squareboat/nestjs-objection';

export interface WeightLogRepositoryContract
  extends RepositoryContract<WeightLogModel> {}
