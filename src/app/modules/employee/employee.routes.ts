import express from 'express';
import { EmployeeController } from './employee.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.organizationAdmin),
  EmployeeController.getAllEmployees,
);
router.get(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  EmployeeController.getSingleEmployee,
);
router.patch(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  EmployeeController.updateEmployee,
);
router.delete(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  EmployeeController.deleteEmployee,
);

export const EmployeeRoutes = router;
