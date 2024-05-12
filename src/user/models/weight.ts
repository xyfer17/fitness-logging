import { BaseModel } from '@squareboat/nestjs-objection';

export class WeightLogModel extends BaseModel {
  static tableName = 'weight_logs';

  id: number;
  userId: number;
  weight: number;
  height: number;
  bicepSize: number;
  thighSize: number;
  bellySize: number;
  createdAt: Date;
  updatedAt: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['weight', 'height'],
      properties: {
        id: { type: 'integer' },
        weight: { type: 'number' },
        height: { type: 'number' },
        bicepSize: { type: 'number' },
        thighSize: { type: 'number' },
        bellySize: { type: 'number' },
      },
    };
  }
}
