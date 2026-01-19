import { Model, Types } from 'mongoose';
import { TBloodGroup, TGender, TUserName } from '../admin/admin.interface';

export interface IOrganizationAdmin {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date | string;
  email: string;
  contactNo: string;
  emergencyContactNo?: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  joiningDate: Date | string;
  ownershipType: 'founder' | 'co-founder' | 'partner';
  isDeleted: boolean;
  organization: Types.ObjectId;
  //
  organizationName: string;

  organizationEmail: string;
  organizationContactNo: string;

  organizationAddress: string;
}
export interface OrganizationAdminModel extends Model<IOrganizationAdmin> {
  // eslint-disable-next-line no-unused-vars
  doesOrganizationAdminExist(_id: string): Promise<IOrganizationAdmin | null>;
}

export type TNewOrganizationAdmin = Partial<IOrganizationAdmin>;
