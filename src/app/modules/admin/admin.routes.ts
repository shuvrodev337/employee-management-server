import express from 'express';
import { AdminController } from './admin.controller';
const router = express.Router();

router.get('/', AdminController.getAllAdmins);
router.get('/:_id', AdminController.getSingleAdmin);
router.patch('/:_id', AdminController.updateAdmin);
router.delete('/:_id', AdminController.deleteAdmin);

export const AdminRoutes = router;
