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
export const EmployeeController = {
  getAllEmployees,
};
