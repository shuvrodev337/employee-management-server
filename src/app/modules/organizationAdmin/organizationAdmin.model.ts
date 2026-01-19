import { Schema, Types, model } from 'mongoose';
import {
  IOrganizationAdmin,
  OrganizationAdminModel,
} from './organizationAdmin.interface';
import { TUserName } from '../admin/admin.interface';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
});

const organizationAdminSchema = new Schema<
  IOrganizationAdmin,
  OrganizationAdminModel
>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    name: { type: userNameSchema, required: [true, 'Name is required'] },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date, required: [true, 'Date of birth is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    joiningDate: {
      type: Date,
      required: true,
    },
    ownershipType: {
      type: String,
      enum: ['founder', 'co-founder', 'partner'],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // // 🏬 Organization Structure
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    // department: {
    //   type:  Schema.Types.ObjectId,
    //   ref: "Department",
    //   required: true,
    // },

    // designation: {
    //   type:  Schema.Types.ObjectId,
    //   ref: "Designation",
    //   required: true,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// generating full name
organizationAdminSchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// filter out deleted documents
organizationAdminSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

organizationAdminSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

organizationAdminSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if organization admin  exists!
organizationAdminSchema.statics.doesOrganizationAdminExist = async function (
  _id: string,
) {
  const existingOrganizationAdmin = await OrganizationAdmin.findById(_id);
  return existingOrganizationAdmin;
};
export const OrganizationAdmin = model<
  IOrganizationAdmin,
  OrganizationAdminModel
>('OrganizationAdmin', organizationAdminSchema);
