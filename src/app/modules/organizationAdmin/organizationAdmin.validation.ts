import z from 'zod';
import {
  createUserNameValidationSchema,
  dateString,
  updateUserNameValidationSchema,
} from '../employee/employee.validation';
// Zod validations

const createOrganizationAdminValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    organizationAdmin: z.object({
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
      ownershipType: z.enum(['founder', 'co-founder', 'partner']),
      organizationName: z.string(),
      organizationEmail: z.string().email(),
      organizationContactNo: z.string(),
      organizationAddress: z.string(),
    }),
  }),
});
const updateOrganizationAdminValidationSchema = z.object({
  organizationAdmin: z.object({
    password: z.string().max(20).optional(),
    employee: z.object({
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
      ownershipType: z.enum(['founder', 'co-founder', 'partner']).optional(),
      organizationName: z.string().optional(),
      organizationEmail: z.string().email().optional(),
      organizationContactNo: z.string().optional(),
      organizationAddress: z.string().optional(),
    }),
  }),
});
export const organizationAdminValidations = {
  createOrganizationAdminValidationSchema,
  updateOrganizationAdminValidationSchema,
};
