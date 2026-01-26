import { model, Schema, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { DepartmentModel, IDepartment } from './department.interface';
const departmentSchema = new Schema<IDepartment, DepartmentModel>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    deparmentHead: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Employee',
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// additional validation on top of -> unique : true
departmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await Department.findOne({
    name: this.name,
  });
  if (isDepartmentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Department already exist!');
  }

  next();
});
departmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery(); // query will get the query  -> { _id: 'example _id'}
  const doesDepartmentExist = await Department.findOne(query);

  if (!doesDepartmentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Department does not exist!');
  }

  next();
});
departmentSchema.statics.doesDepartmentExist = async function (
  _id: string | Types.ObjectId,
  organization_Id: string | Types.ObjectId,
) {
  const department = await Department.findOne({
    _id,
    organization: organization_Id,
  });
  return department;
};
export const Department = model<IDepartment, DepartmentModel>(
  'Department',
  departmentSchema,
);
