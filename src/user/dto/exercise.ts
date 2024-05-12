import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { DayEnum } from '../enums';

@ValidatorConstraint({ name: 'timeFormat', async: false })
export class TimeFormatConstraint implements ValidatorConstraintInterface {
  validate(timeString: string) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timeRegex.test(timeString);
  }

  defaultMessage() {
    return 'Invalid time format. The format should be HH:MM:SS';
  }
}

export function IsTimeFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTimeFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: TimeFormatConstraint,
    });
  };
}

export class ExerciseDto {
  @IsString()
  @IsNotEmpty()
  exerciseName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt({ message: 'duration must be integer in seconds' })
  @IsNotEmpty()
  duration: number;

  @IsTimeFormat()
  @IsNotEmpty()
  time: string;

  @IsEnum(DayEnum)
  @IsNotEmpty()
  day: DayEnum;

  @IsDateString()
  @IsNotEmpty()
  date: string;
}
