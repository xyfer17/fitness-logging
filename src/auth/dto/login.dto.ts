import { AppConstants } from '@app/app.constant';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class loginDto {
  @Matches(AppConstants.EMAIL_REGEX, {
    message: AppConstants.INVALID_EMAIL,
  })
  @IsNotEmpty()
  @MaxLength(40, {
    message: AppConstants.EMAIL_TOO_LONG,
  })
  email: string;

  @IsNotEmpty()
  password: string;
}
