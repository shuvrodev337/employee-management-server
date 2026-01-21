import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { employeeValidations } from '../employee/employee.validation';
import { adminValidations } from '../admin/admin.validation';
import { organizationAdminValidations } from '../organizationAdmin/organizationAdmin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/create-employee',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(employeeValidations.createEmployeeValidationSchema),
  UserController.createEmployee,
);
router.post(
  '/create-admin',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(adminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);
router.post(
  '/create-organizationAdmin',
  validateRequest(
    organizationAdminValidations.createOrganizationAdminValidationSchema,
  ),
  UserController.createOrganizationAdmin,
);

export const UserRoutes = router;
