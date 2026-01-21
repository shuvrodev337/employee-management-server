import z from 'zod';
import {
  createUserNameValidationSchema,
  dateString,
  updateUserNameValidationSchema,
} from '../employee/employee.validation';

const createAdminValidationSchema = z.object({
  body: z.object({
    // password: z.string().max(20).optional(),
    admin: z.object({
      name: createUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: dateString,
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      joiningDate: dateString,
      employmentType: z.enum([
        'permanent',
        'partTime',
        'internship',
        'contractual',
      ]),
      // organization: z.string(),

      //   department: z.string(),
      //   designation: z.string(),
    }),
  }),
});
const updateAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    admin: z.object({
      name: updateUserNameValidationSchema.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: dateString.optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      joiningDate: dateString.optional(),
      employmentType: z
        .enum(['permanent', 'partTime', 'internship', 'contractual'])
        .optional(),
      organization: z.string().optional(),
      //   department: z.string().optional(),
      //   designation: z.string().optional(),
    }),
  }),
});
export const adminValidations = {
  createAdminValidationSchema,
  updateAdminValidationSchema,
};
