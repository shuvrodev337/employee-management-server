import { Model, Types } from 'mongoose';
import { TBloodGroup, TGender, TUserName } from '../admin/admin.interface';

export interface IEmployee {
  id: string;
  user: Types.ObjectId;

  name: TUserName;
  gender: TGender;
  dateOfBirth: Date | string;
  bloodGroup: TBloodGroup;
  email: string;
  contactNo: string;
  emergencyContactNo: string;

  presentAddress: string;
  permanentAddress: string;
  joiningDate: Date | string;
  employmentType: 'permanent' | 'partTime' | 'internship' | 'contractual';

  isDeleted?: boolean;

  //   department: Types.ObjectId;
  //   designation: Types.ObjectId;
  //   manager?: Types.ObjectId;
}
export interface EmployeeModel extends Model<IEmployee> {
  // eslint-disable-next-line no-unused-vars
  doesEmployeeExist(_id: string): Promise<IEmployee | null>;
}

export type TNewEmployee = Partial<IEmployee>;
