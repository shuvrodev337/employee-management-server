import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { EmployeeRoutes } from '../modules/employee/employee.routes';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/employees',
    route: EmployeeRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
