import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB();
  sendResponse(res, {
    success: true,
    message: 'Admins retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const AdminController = {
  getAllAdmins,
};
