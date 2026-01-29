import { z } from 'zod';

const createDesignationValidationSchema = z.object({
  body: z.object({
    title: z.string({
      invalid_type_error: 'Designation must be string',
      required_error: 'Title is required',
    }),
    level: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'MANAGER']),
    department: z.string({
      invalid_type_error: 'Department must be string',
      required_error: 'Department is required',
    }),
    organization: z.string({
      invalid_type_error: 'Organization must be string',
      required_error: 'Organization is required',
    }),

    baseSalary: z.number({
      invalid_type_error: 'Base Salary must be number',
      required_error: 'Base Salary is required',
    }),
  }),
});

const updateDesignationValidationSchema = z.object({
  body: z.object({
    title: z
      .string({
        invalid_type_error: 'Title must be string',
      })
      .optional(),
    level: z.enum(['INTERN', 'JUNIOR', 'MID', 'SENIOR', 'LEAD', 'MANAGER']),
    department: z
      .string({
        invalid_type_error: 'Department must be string',
      })
      .optional(),
    organization: z
      .string({
        invalid_type_error: 'Organization must be string',
      })
      .optional(),

    baseSalary: z
      .number({
        invalid_type_error: 'Base Salary must be number',
      })
      .optional(),
  }),
});

export const designationValidation = {
  createDesignationValidationSchema,
  updateDesignationValidationSchema,
};
