import { Model, Types } from 'mongoose';

export interface IOrganization {
  id: string;
  organizationName: string;

  organizationEmail: string; // official company email
  contactNo: string;

  address: string;

  isActive: boolean;
  isDeleted: boolean;

  organizationAdmin: Types.ObjectId; // organizationAdmin _id
  createdAt?: Date;
  updatedAt?: Date;
}
export interface OrganizationModel extends Model<IOrganization> {
  // eslint-disable-next-line no-unused-vars
  doesOrganizationExist(_id: string): Promise<IOrganization | null>;
}
export type TNewOrganization = Partial<IOrganization>;
