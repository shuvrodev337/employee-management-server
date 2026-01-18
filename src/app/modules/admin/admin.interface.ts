import { Model, Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export interface IAdmin {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  dateOfBirth: Date | string;
  joiningDate: Date | string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  employmentType: 'permanent' | 'partTime' | 'internship' | 'contractual';
  isDeleted: boolean;
  //   department: Types.ObjectId;
  //   designation: Types.ObjectId;
}
export interface AdminModel extends Model<IAdmin> {
  // eslint-disable-next-line no-unused-vars
  doesAdminExist(_id: string): Promise<IAdmin | null>;
}

export type TNewAdmin = Partial<IAdmin>;
