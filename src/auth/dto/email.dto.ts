import { AppConstants } from '@app/app.constant';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

export class EmailDto {
  @Matches(AppConstants.EMAIL_REGEX, {
    message: AppConstants.INVALID_EMAIL,
  })
  @MaxLength(40, {
    message: AppConstants.EMAIL_TOO_LONG,
  })
  @IsNotEmpty()
  email: string;
}
