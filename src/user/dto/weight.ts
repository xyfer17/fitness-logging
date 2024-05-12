import { IsDateString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class WeightDto {
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be integer (kg)' })
  @Min(0)
  @IsNotEmpty()
  weight: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be integer (inches)' })
  @Min(0)
  @IsNotEmpty()
  height: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be integer (inches)' })
  @Min(0)
  @IsNotEmpty()
  bicepSize: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be integer (inches)' })
  @Min(0)
  @IsNotEmpty()
  thighSize: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be integer (inches)' })
  @Min(0)
  @IsNotEmpty()
  bellySize: number;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
