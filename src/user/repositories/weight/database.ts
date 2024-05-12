import { WeightLogModel } from '../../models';
import { Injectable } from '@nestjs/common';
import { WeightLogRepositoryContract } from './contract';
import { DatabaseRepository, InjectModel } from '@squareboat/nestjs-objection';

@Injectable()
export class WeightLogRepository
  extends DatabaseRepository<WeightLogModel>
  implements WeightLogRepositoryContract
{
  @InjectModel(WeightLogModel)
  model: WeightLogModel;
}
