import { Types } from 'mongoose';
import { USER_ROLE } from './user.constant';
import { Model } from 'mongoose';

/* eslint-disable no-unused-vars */
export interface IUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'superAdmin' | 'admin' | 'employee' | 'organizationAdmin';
  status: 'in-progress' | 'blocked';
  organization: Types.ObjectId;
  isDeleted: boolean;
  passwordChangedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
export type TNewUser = Partial<IUser>;

export type TUserRole = keyof typeof USER_ROLE;
export interface UserModel extends Model<IUser> {
  //instance methods
  isUserExistsByCustomId(id: string): Promise<IUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  isUserBlocked(id: string): Promise<boolean>;
  isUserDeleted(id: string): Promise<boolean>;
  isUserAccessDenied(
    id: string,
    accessRequestedOrganization_id: string,
  ): Promise<boolean>;
  isPasswordChangedAfterJWTissued(
    passwordChangedAt: Date,
    jwtIssuedAt: number,
  ): boolean;
}
