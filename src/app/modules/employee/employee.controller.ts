import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EmployeeServices } from './employee.service';

const getAllEmployees = catchAsync(async (req, res) => {
  const result = await EmployeeServices.getAllEmployeesFromDB();
  sendResponse(res, {
    success: true,
    message: 'Employee retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleEmployee = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await EmployeeServices.getSingleEmployeeFromDB(_id);
  sendResponse(res, {
    success: true,
    message: 'Employee retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateEmployee = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { employee: updateData } = req.body;
  const result = await EmployeeServices.updateEmployeeIntoDB(_id, updateData);
  sendResponse(res, {
    success: true,
    message: 'Employee updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteEmployee = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await EmployeeServices.deleteEmployeeFromDB(_id);
  sendResponse(res, {
    success: true,
    message: 'Employee deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const EmployeeController = {
  getAllEmployees,
  getSingleEmployee,
  updateEmployee,
  deleteEmployee,
};
