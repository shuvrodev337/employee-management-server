import { Model, Types } from 'mongoose';

export interface IDesignation {
  _id: Types.ObjectId;

  title: string;
  level: 'INTERN' | 'JUNIOR' | 'MID' | 'SENIOR' | 'LEAD' | 'MANAGER';

  department: Types.ObjectId | string;
  organization: Types.ObjectId | string;

  baseSalary: number;

  isDeleted?: boolean;
}
export interface DesignationModel extends Model<IDesignation> {
  // eslint-disable-next-line no-unused-vars
  doesDesignationExist(
    // eslint-disable-next-line no-unused-vars
    _id: string | Types.ObjectId,
    // eslint-disable-next-line no-unused-vars
    organizaton_Id: string | Types.ObjectId,
  ): Promise<IDesignation | null>;
}
