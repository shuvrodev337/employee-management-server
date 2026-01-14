import express from 'express';
import { EmployeeController } from './employee.controller';
const router = express.Router();

router.get('/', EmployeeController.getAllEmployees);

export const EmployeeRoutes = router;
