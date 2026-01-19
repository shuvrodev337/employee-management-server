import { Model, Types } from 'mongoose';

export interface IOrganization {
  // _id: Types.ObjectId;
  id: string;
  organizationName: string;

  organizationEmail: string; // official company email
  organizationContactNo: string;

  organizationAddress: string;

  isActive: boolean;
  isDeleted: boolean;

  organizationAdmin: Types.ObjectId | null; // organizationAdmin _id
  createdAt?: Date;
  updatedAt?: Date;
}
export interface OrganizationModel extends Model<IOrganization> {
  // eslint-disable-next-line no-unused-vars
  doesOrganizationExist(_id: string): Promise<IOrganization | null>;
}
export type TNewOrganization = Partial<IOrganization>;
