import { z } from 'zod';

const updateOrganizationtionValidationSchema = z.object({
  body: z.object({
    organizationName: z.string().optional(),
    organizationEmail: z.string().email().optional(),
    organizationContactNo: z.string().optional(),
    organizationAddress: z.string().optional(),
  }),
});

export const organizationtionValidation = {
  updateOrganizationtionValidationSchema,
};
