import { registerAs } from '@nestjs/config';

// all third-party services' configurations to go here
export default registerAs('services', () => ({
  mail_secret: process.env.MAIL_SECRET,
  verificaiton_url: process.env.VERIFICATION_URL,
  mail_service: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  },
  auth: {
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  },
}));
