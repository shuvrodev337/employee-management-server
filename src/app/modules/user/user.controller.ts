import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createEmployee = catchAsync(async (req, res) => {
  const { password, employee } = req.body;
  const result = await UserServices.createEmployeeIntoDB(password, employee);
  sendResponse(res, {
    success: true,
    message: 'Employee created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdminIntoDB(password, admin);
  sendResponse(res, {
    success: true,
    message: 'Admin created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const UserController = {
  createEmployee,
  createAdmin,
};
