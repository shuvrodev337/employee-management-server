import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { OrganizationController } from './organization.controller';
import validateRequest from '../../middlewares/validateRequest';
import { organizationtionValidation } from './organization.validation';
const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin),
  OrganizationController.getAllOrganizations,
);
router.get(
  '/:_id',
  auth(USER_ROLE.superAdmin, USER_ROLE.organizationAdmin, USER_ROLE.admin),
  OrganizationController.getSingleOrganization,
);
router.patch(
  '/:_id',
  validateRequest(
    organizationtionValidation.updateOrganizationtionValidationSchema,
  ),
  auth(USER_ROLE.organizationAdmin),

  OrganizationController.updateOrganization,
);
router.delete(
  '/:_id',
  auth(USER_ROLE.organizationAdmin),
  OrganizationController.deleteteOrganization,
);

export const OrganizationRoutes = router;
