import { Types } from 'mongoose';
import { TBloodGroup, TGender, TUserName } from '../admin/admin.interface';

export interface IEmployee {
  id: string;
  user: Types.ObjectId;

  name: TUserName;
  gender: TGender;
  dateOfBirth: Date;
  bloodGroup?: TBloodGroup;
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
