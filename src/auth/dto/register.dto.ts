import { AppConstants } from '@app/app.constant';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role } from '../enum/role.enum';

export class CreateUserDto {
  @IsEmail()
  @MaxLength(40, {
    message: AppConstants.EMAIL_TOO_LONG,
  })
  @IsNotEmpty()
  email: string;

  @Matches(AppConstants.PASSWORD_REGEX, {
    message: AppConstants.INVALID_PASSWORD_REGEX,
  })
  @MinLength(8, {
    message: AppConstants.INVALID_PASSWORD_REGEX,
  })
  @MaxLength(128, {
    message: AppConstants.PASSWORD_TOO_LONG,
  })
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  @IsNotEmpty()
  roleType: Role;
}
