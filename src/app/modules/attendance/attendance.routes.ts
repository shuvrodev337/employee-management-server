import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AttendanceController } from './attendance.controller';
import { attendanceValidation } from './attendance.validation';
const router = express.Router();

router.post(
  '/create-attendance',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  validateRequest(attendanceValidation.createAttendanceValidationSchema),
  AttendanceController.createAttendance,
);
router.post(
  '/checkOut',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  validateRequest(attendanceValidation.checkOutValidationSchema),
  AttendanceController.checkOutAttendance,
);
// router.get(
//   '/',
//   auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
//   DepartmentController.getAllDepartments,
// );
// router.get(
//   '/:_id',
//   auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
//   DepartmentController.getSingleDepartment,
// );
// router.patch(
//   '/:_id',
//   auth(USER_ROLE.organizationAdmin),
//   validateRequest(departmentValidation.updateDepartmentValidationSchema),
//   DepartmentController.updateDepartment,
// );
// router.patch(
//   '/assign-department-head/:_id',
//   auth(USER_ROLE.organizationAdmin),
//   validateRequest(departmentValidation.assignDepartmentHeadValidationSchema),
//   DepartmentController.assignDepartmentHead,
// );
router.delete(
  '/:_id',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  AttendanceController.deleteAttendance,
);

export const AttendanceRoutes = router;
