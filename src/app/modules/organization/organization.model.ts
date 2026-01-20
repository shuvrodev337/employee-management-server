import { model, Schema } from 'mongoose';
import { IOrganization, OrganizationModel } from './organization.interface';

const organizationSchema = new Schema<IOrganization, OrganizationModel>({
  id: {
    type: String,
    required: [true, 'ID is required'],
    unique: true,
  },
  organizationName: {
    type: String,
    trim: true,
    unique: true,
    required: [true, 'Organization Name is required'],
  },
  organizationEmail: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  organizationContactNo: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  organizationAddress: {
    type: String,
    required: [true, 'Address is required'],
  },
  organizationAdmin: {
    type: Schema.Types.ObjectId,
    ref: 'OrganizationAdmin',
    // required: true,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
// filter out deleted documents
organizationSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

organizationSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

organizationSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if organization  exists!
organizationSchema.statics.doesOrganizationExist = async function (id: string) {
  console.log('doesOrganizationExist called with:', id, typeof id);
  const existingOrganization = await Organization.findOne({ id });
  return existingOrganization;
};
export const Organization = model<IOrganization, OrganizationModel>(
  'Organization',
  organizationSchema,
);
