import z from 'zod';

const createAttendanceValidationSchema = z.object({
  body: z.object({
    user: z.string(),
    remarks: z.string(),
  }),
});
const checkOutValidationSchema = z.object({
  body: z.object({
    user: z.string(),
    remarks: z.string(),
  }),
});

export const attendanceValidation = {
  createAttendanceValidationSchema,
  checkOutValidationSchema,
};
