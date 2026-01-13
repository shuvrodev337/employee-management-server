import express from 'express';
import { UserController } from './user.controller';
const router = express.Router();

router.post('/create-employee', UserController.createEmployee);

export const UserRoutes = router;
