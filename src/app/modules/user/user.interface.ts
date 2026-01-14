import { USER_ROLE } from './user.constant';

/* eslint-disable no-unused-vars */
export interface IUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'superAdmin' | 'admin' | 'employee';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export type TNewUser = Partial<IUser>;

export type TUserRole = keyof typeof USER_ROLE;
