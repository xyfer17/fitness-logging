import { registerAs } from '@nestjs/config';

// all your application settings go here.
export default registerAs('settings', () => ({
  email_timer: process.env.EMAIL_TIMER,
  reset_password_secret: process.env.RESET_PASSWORD_SECRET,
  reset_password_url: process.env.RESET_PASSWORD_URL,
}));
