import express from 'express';
import { EmployeeController } from './employee.controller';
const router = express.Router();

router.get('/', EmployeeController.getAllEmployees);
router.get('/:_id', EmployeeController.getSingleEmployee);
router.patch('/:_id', EmployeeController.updateEmployee);
router.delete('/:_id', EmployeeController.deleteEmployee);

export const EmployeeRoutes = router;
