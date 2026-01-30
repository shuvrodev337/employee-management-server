import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OrganizationServices } from './organization.service';

const getAllOrganizations = catchAsync(async (req, res) => {
  const result = await OrganizationServices.getAllOrganizationsFromDb();
  sendResponse(res, {
    success: true,
    message: 'Organizations retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleOrganization = catchAsync(async (req, res) => {
  const { _id: organization_id } = req.params;

  const result =
    await OrganizationServices.getSingleOrganizationFromDB(organization_id);
  sendResponse(res, {
    success: true,
    message: 'Organization retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateOrganization = catchAsync(async (req, res) => {
  const { _id: organization_id } = req.params;
  const { userId: organizationAdmin_userId } = req.user;
  const organizationInfo = req.body;

  const result = await OrganizationServices.updateOrganizationIntoDB(
    organization_id,
    organizationAdmin_userId,
    organizationInfo,
  );
  sendResponse(res, {
    success: true,
    message: 'Organization updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const deleteteOrganization = catchAsync(async (req, res) => {
  const { _id: organization_id } = req.params;
  const { userId: organizationAdmin_userId } = req.user;

  const result = await OrganizationServices.deleteteOrganizationFromDB(
    organization_id,
    organizationAdmin_userId,
  );
  sendResponse(res, {
    success: true,
    message: 'Organization deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const OrganizationController = {
  getAllOrganizations,
  getSingleOrganization,
  updateOrganization,
  deleteteOrganization,
};
