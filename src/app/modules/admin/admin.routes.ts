import express from 'express';
import { AdminController } from './admin.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.organizationAdmin),
  AdminController.getAllAdmins,
);
router.get(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  AdminController.getSingleAdmin,
);
router.patch(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  AdminController.updateAdmin,
);
router.delete(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  AdminController.deleteAdmin,
);

export const AdminRoutes = router;
