import {  IsNotEmpty, IsNumber, Min } from 'class-validator';

export class WeightDto {
  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be number (kg)' })
  @IsNotEmpty()
  weight: number;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be number (inches)' })
  @IsNotEmpty()
  height: number;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be number (inches)' })
  @IsNotEmpty()
  bicepSize: number;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be number (inches)' })
  @IsNotEmpty()
  thighSize: number;

  @Min(0)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'must be number (inches)' })
  @IsNotEmpty()
  bellySize: number;
}
