import z from 'zod';
// Zod validations
export const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
  message: 'Invalid date format',
});

export const createUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, {
      message: 'First name must be capitalized and must only contain letters',
    }),
  middleName: z.string().trim().max(20).optional(),
  lastName: z
    .string()
    .trim()
    .regex(/^[A-Za-z]+$/, { message: 'Last name must contain only letters' }),
});
export const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, {
      message: 'First name must be capitalized and must only contain letters',
    })
    .optional(),
  middleName: z.string().trim().max(20).optional(),
  lastName: z
    .string()
    .trim()
    .regex(/^[A-Za-z]+$/, { message: 'Last name must contain only letters' })
    .optional(),
});
const createEmployeeValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    employee: z.object({
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
      //   organization: z.string(),
      //   department: z.string(),
      //   designation: z.string(),
      //   manager: z.string(),
    }),
  }),
});
const updateEmployeeValidationSchema = z.object({
  body: z.object({
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
      employmentType: z
        .enum(['permanent', 'partTime', 'internship', 'contractual'])
        .optional(),
      //   organization: z.string().optional(),
      //   department: z.string().optional(),
      //   designation: z.string().optional(),
      //   manager: z.string().optional(),
    }),
  }),
});
export const employeeValidations = {
  createEmployeeValidationSchema,
  updateEmployeeValidationSchema,
};
