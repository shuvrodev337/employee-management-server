import { Types } from 'mongoose';

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
  dateOfBirth?: Date;
  joiningDate: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  employmentType: 'permanent' | 'partTime' | 'internship' | 'contractual';
  isDeleted: boolean;
  //   department: Types.ObjectId;
  //   designation: Types.ObjectId;
}
export type TNewAdmin = Partial<IAdmin>;
