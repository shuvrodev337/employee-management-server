import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { DepartmentController } from './department.controller';
const router = express.Router();

router.post(
  '/create-department',
  auth(USER_ROLE.organizationAdmin),
  DepartmentController.createDepartment,
);
router.get(
  '/',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  DepartmentController.getAllDepartments,
);
router.get(
  '/:_id',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  DepartmentController.getSingleDepartment,
);
// router.patch(
//   '/:_id',
//   auth(USER_ROLE.organizationAdmin),
//   DepartmentController.updateEmployee,
// );
// router.delete(
//   '/:_id',
//   auth(USER_ROLE.organizationAdmin),
//   DepartmentController.deleteEmployee,
// );

export const DepartmentRoutes = router;
