import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { DesignationController } from './designation.controller';
import validateRequest from '../../middlewares/validateRequest';
import { designationValidation } from './designation.validation';
const router = express.Router();

router.post(
  '/create-designation',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(designationValidation.createDesignationValidationSchema),

  DesignationController.createDesignation,
);
router.get(
  '/:_id',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  DesignationController.getAllDesignations,
);
router.get(
  '/designation/:_id',
  auth(USER_ROLE.organizationAdmin, USER_ROLE.admin),
  DesignationController.getSingleDesignation,
);
router.patch(
  '/designation/:_id',
  auth(USER_ROLE.organizationAdmin),
  validateRequest(designationValidation.updateDesignationValidationSchema),

  DesignationController.updateDesignation,
);
router.delete(
  '/designation/:_id',
  auth(USER_ROLE.organizationAdmin),
  DesignationController.deleteDesignation,
);

export const DesignationRoutes = router;
