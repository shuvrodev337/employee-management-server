import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { OrganizationAdminController } from './organizationAdmin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { organizationAdminValidations } from './organizationAdmin.validation';
const router = express.Router();

router.get(
  '/',
  //   auth(USER_ROLE.superAdmin),
  OrganizationAdminController.getAllOrganizationAdmins,
);
router.get(
  '/:_id',
  auth(USER_ROLE.superAdmin, USER_ROLE.organizationAdmin),
  OrganizationAdminController.getSingleOrganizationAdmin,
);
router.patch(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(
    organizationAdminValidations.updateOrganizationAdminValidationSchema,
  ),
  OrganizationAdminController.updateOrganizationAdmin,
);
router.delete(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  OrganizationAdminController.deleteOrganizationAdmin,
);

export const OrganizationAdminRoutes = router;
