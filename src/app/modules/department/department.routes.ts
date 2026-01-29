import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { DepartmentController } from './department.controller';
import validateRequest from '../../middlewares/validateRequest';
import { departmentValidation } from './department.validation';
const router = express.Router();

router.post(
  '/create-department',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(departmentValidation.createDepartmentValidationSchema),
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
router.patch(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(departmentValidation.updateDepartmentValidationSchema),
  DepartmentController.updateDepartment,
);
router.patch(
  '/assign-department-head/:_id',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(departmentValidation.assignDepartmentHeadValidationSchema),
  DepartmentController.assignDepartmentHead,
);
router.delete(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  DepartmentController.deleteDepartment,
);

export const DepartmentRoutes = router;
