import { z } from 'zod';

const createDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Department must be string',
      required_error: 'Name is required',
    }),
    deparmentHead: z.string({
      invalid_type_error: 'Deparment Head must be string',
      required_error: 'Deparment Head is required',
    }),
  }),
});

const updateDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: ' department must be string',
      })
      .optional(),
    deparmentHead: z
      .string({
        invalid_type_error: 'Deparment Head must be string',
      })
      .optional(),
  }),
});

export const departmentValidation = {
  createDepartmentValidationSchema,
  updateDepartmentValidationSchema,
};
