import { Employee } from './employee.model';

const getAllEmployeesFromDB = async () => {
  const employees = await Employee.find();
  return employees;
};

export const EmployeeServices = {
  getAllEmployeesFromDB,
};
