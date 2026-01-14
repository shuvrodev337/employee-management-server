import { Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};
export interface IEmployee {
  id: string;
  user: Types.ObjectId;

  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  email: string;
  contactNo: string;
  emergencyContactNo: string;

  presentAddress: string;
  permanentAddress: string;
  joiningDate: Date;
  employmentType: 'permanent' | 'partTime' | 'internship' | 'contractual';

  isDeleted?: boolean;

  //   department: Types.ObjectId;
  //   designation: Types.ObjectId;
  //   manager?: Types.ObjectId;
}

export type TNewEmployee = Partial<IEmployee>;
