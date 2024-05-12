export class AppConstants {
  static INVALID_PASSWORD_REGEX =
    'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one digit, and one special character (!@#$%^&*()_+={[}|:;<>,.)';
  static INVALID_EMAIL =
    'Invalid email address. The part before @ must contains characters and can only include letters, numbers and . period';
  static USER_NOT_FOUND = 'User not found';
  static USER_NOT_VERIFIED = 'User is not verified';
  static USER_ALREADY_VERIFIED = 'User already verified';
  static MAIL_ALREADY_SENT = 'Email already sent';
  static TOKEN_EXPIRED = 'Token expired';
  static USER_REGISTERED_SUCCESSFULLY = 'User registration successful';
  static MAIL_NOT_SENT = 'Verification Email not sent';
  static MAIL_SENT_SUCCESSFULLY = 'Verification Email sent successfully';
  static PASSWORD_SET_SUCCESSFULLY = 'Password set successfully';
  static LOGGED_IN = 'Logged in successfully';
  static USER_ALREADY_EXITS = 'User already exists';
  static USER_ALREADY_REGISTERED =
    'User already registered through email address, use email address for login';

  static INVALID_LOGIN_CREDENTIAL = 'Invalid login credentials';
  static PASSWORD_NOT_FOUND = 'User have to set password, before login';
  static TOKEN_REFRESHED = 'Token Refreshed Successfully';
  static INVALID_REFRESH_TOKEN = 'Invalid refresh token';

  static NOT_REGISTERED = 'User Not Registered';

  static NOT_CREATED = 'request data not created';
  static EMAIL_REGEX =
    /^[^\s^!@#$%^&*()\-+=\{\}\[\]|\\:;'"<,>?/\x00-\x1F\x7F]{1,}@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/;
  static PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={[}\]|:;<>,.?\/\\-]).{8,}$/;
  static PASSWORD_TOO_LONG =
    'Password is too long and should not exceed 128 characters';
  static EMAIL_TOO_LONG =
    'Email is too long and should not exceed 40 characters';
  static EMAIL_INVALID_START =
    'Invalid email address. Email cannot start with . Character';
  static MAX_CHAR_LENGTH = 255;
}
