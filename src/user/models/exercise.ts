import { BaseModel } from '@squareboat/nestjs-objection';
import { DayEnum } from '../enums';

export class ExerciseLogModel extends BaseModel {
  static tableName = 'exercise_logs';

  id: number;
  userId: number;
  exerciseName: string;
  description: string;
  duration: number;
  time: string;
  day: DayEnum;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
