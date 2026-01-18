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
const getSingleAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(_id);
  sendResponse(res, {
    success: true,
    message: 'Admin retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { admin: updateData } = req.body;
  const result = await AdminServices.updateAdminIntoDB(_id, updateData);
  sendResponse(res, {
    success: true,
    message: 'Admin updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(_id);
  sendResponse(res, {
    success: true,
    message: 'Admin deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const AdminController = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
