import { Model, Types } from 'mongoose';

export interface IDepartment {
  name: string;
  deparmentHead: Types.ObjectId;
  organization: Types.ObjectId | string;

  isDeleted: boolean;
}
export interface DepartmentModel extends Model<IDepartment> {
  // eslint-disable-next-line no-unused-vars
  doesDepartmentExist(
    // eslint-disable-next-line no-unused-vars
    _id: string | Types.ObjectId,
    // eslint-disable-next-line no-unused-vars
    organizaton_Id: string | Types.ObjectId,
  ): Promise<IDepartment | null>;
}
