// import { ObjectId } from 'mongoose';
import { USER_ROLE } from './user.constant';

/* eslint-disable no-unused-vars */
export interface TUser {
  //   _id: ObjectId;
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'superAdmin' | 'admin' | 'employee';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
  passwordChangedAt?: Date;
}
export type TNewUser = Partial<TUser>;

export type TUserRole = keyof typeof USER_ROLE;
