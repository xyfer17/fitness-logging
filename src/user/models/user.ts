import { BaseModel } from '@squareboat/nestjs-objection';

export class UserModel extends BaseModel {
  static tableName = 'users';
  id: number;
  email: string;
  password: string;
  lastSendMail: Date;
  emailVerifiedAt: Date;
  refreshToken: string;
  isAdmin: boolean;
  passwordResetToken: string;
  resetPasswordStatus: boolean;
  meta: Record<string, any>;
  lastLoginAt: Date;
  passwordResetTimestamp: Date;
  status: 'active' | 'inactive';
  roleType: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}
