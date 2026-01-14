import config from '../../config';
import { TNewEmployee } from '../employee/employee.interface';
import { Employee } from '../employee/employee.model';
import { TNewUser } from './user.interface';
import { User } from './user.model';

const createEmployeeIntoDB = async (
  password: string,
  employeeData: TNewEmployee,
) => {
  // create user
  const userData: TNewUser = {};
  userData.password = password || config.default_pass;
  userData.role = 'employee';
  userData.email = employeeData.email;

  //todo: generate formatted id for user , update model for user id
  // userData.id = await generateStudentId(admissionSemester);
  userData.id = '001';
  const newUser = await User.create(userData);

  // create employee

  employeeData.id = newUser.id;
  employeeData.user = newUser._id;
  // employeeData.id = newUser[0].id;
  // employeeData.user = newUser[0]._id;
  const newEmployee = await Employee.create(employeeData);

  return newEmployee;
};
export const UserServices = {
  createEmployeeIntoDB,
};
