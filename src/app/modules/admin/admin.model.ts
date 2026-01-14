import { Schema, model } from 'mongoose';
import { IAdmin, TUserName } from './admin.interface';

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

const adminSchema = new Schema<IAdmin>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      //  unique: true,
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
    dateOfBirth: { type: Date },
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
    employmentType: {
      type: String,
      enum: ['permanent', 'partTime', 'internship', 'contractual'],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    // // 🏬 Organization Structure
    // department: {
    //   type: Types.ObjectId,
    //   ref: "Department",
    //   required: true,
    // },

    // designation: {
    //   type: Types.ObjectId,
    //   ref: "Designation",
    //   required: true,
    // },

    // manager: {
    //   type: Types.ObjectId,
    //   ref: "Employee",
    //   default: null,
    // },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// // 🔎 Indexes (Performance)
// employeeSchema.index({ email: 1 });
// employeeSchema.index({ department: 1 });
// employeeSchema.index({ designation: 1 });
// employeeSchema.index({ manager: 1 });
// employeeSchema.index({ isDeleted: 1 });

export const Admin = model<IAdmin>('Admin', adminSchema);
