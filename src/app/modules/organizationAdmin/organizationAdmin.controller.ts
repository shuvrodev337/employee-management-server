import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrganizationAdminServices } from './organizationAdmin.service';

const getAllOrganizationAdmins = catchAsync(async (req, res) => {
  const result =
    await OrganizationAdminServices.getAllOrganizationAdminsFromDB();
  sendResponse(res, {
    success: true,
    message: 'Organization Admins retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleOrganizationAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;

  const result =
    await OrganizationAdminServices.getSingleOrganizationAdminFromDB(_id);
  sendResponse(res, {
    success: true,
    message: 'Organization Admin retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateOrganizationAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { organization } = req.user;
  const { organizationAdmin: updateData } = req.body;
  const result = await OrganizationAdminServices.updateOrganizationAdminIntoDB(
    _id,
    organization,
    updateData,
  );
  sendResponse(res, {
    success: true,
    message: 'Organization Admin updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

const deleteOrganizationAdmin = catchAsync(async (req, res) => {
  const { _id } = req.params;
  const { organization } = req.user;

  const result = await OrganizationAdminServices.deleteOrganizationAdminFromDB(
    _id,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Organization Admin deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const OrganizationAdminController = {
  getAllOrganizationAdmins,
  getSingleOrganizationAdmin,
  updateOrganizationAdmin,
  deleteOrganizationAdmin,
};
