import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const getAllAdmins = catchAsync(async (req, res) => {
  const { organization } = req.user;
  const result = await AdminServices.getAllAdminsFromDB(organization);
  sendResponse(res, {
    success: true,
    message: 'Admins retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { organization } = req.user;
  const result = await AdminServices.getSingleAdminFromDB(_id, organization);
  sendResponse(res, {
    success: true,
    message: 'Admin retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { organization } = req.user;
  const { admin: updateData } = req.body;
  const result = await AdminServices.updateAdminIntoDB(
    _id,
    organization,
    updateData,
  );
  sendResponse(res, {
    success: true,
    message: 'Admin updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { organization } = req.user;

  const result = await AdminServices.deleteAdminFromDB(_id, organization);
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
