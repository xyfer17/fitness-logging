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
  date: Date;
  createdAt: Date;
  updatedAt: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['weight', 'height', 'date'],
      properties: {
        id: { type: 'integer' },
        weight: { type: 'number' },
        height: { type: 'number' },
        bicepSize: { type: 'number' },
        thighSize: { type: 'number' },
        bellySize: { type: 'number' },
        date: { type: 'string', format: 'date' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }
}
