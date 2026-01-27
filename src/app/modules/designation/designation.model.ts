import { model, Schema, Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { DesignationModel, IDesignation } from './designation.interface';
const designationSchema = new Schema<IDesignation, DesignationModel>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    level: {
      type: String,
      enum: ['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'MANAGER'],
    },
    baseSalary: {
      type: Number,
      required: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Department',
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
designationSchema.pre('save', async function (next) {
  const isDesignationExist = await Designation.findOne({
    title: this.title,
  });
  if (isDesignationExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Designation already exist!');
  }

  next();
});
designationSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery(); // query will get the query  -> { _id: 'example _id'}
  const doesDesignationExist = await Designation.findOne(query);

  if (!doesDesignationExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Designation does not exist!');
  }

  next();
});
designationSchema.statics.doesDesignationExist = async function (
  _id: string | Types.ObjectId,
  organization_Id: string | Types.ObjectId,
) {
  const designation = await Designation.findOne({
    _id,
    organization: organization_Id,
  });
  return designation;
};
export const Designation = model<IDesignation, DesignationModel>(
  'Designation',
  designationSchema,
);
