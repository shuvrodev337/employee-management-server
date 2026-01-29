import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DesignationServices } from './designation.service';

const createDesignation = catchAsync(async (req, res) => {
  const designation = req.body;
  const { organization } = req.user;
  const result = await DesignationServices.createDesignationIntoDb(
    designation,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Designation created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getAllDesignations = catchAsync(async (req, res) => {
  const { _id: department_Id } = req.params;

  const { organization } = req.user;
  const result = await DesignationServices.getAllDesignatiosFromDb(
    department_Id,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Designations retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleDesignation = catchAsync(async (req, res) => {
  const { _id: designation_id } = req.params;
  const { organization } = req.user;

  const result = await DesignationServices.getSingleDesignationFromDB(
    designation_id,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Designation retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateDesignation = catchAsync(async (req, res) => {
  const { _id: designation_id } = req.params;
  const { organization } = req.user;
  const designationInfo = req.body;

  const result = await DesignationServices.updateDesignatoinIntoDB(
    designation_id,
    organization,
    designationInfo,
  );
  sendResponse(res, {
    success: true,
    message: 'Designation updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const deleteDesignation = catchAsync(async (req, res) => {
  const { _id: designation_id } = req.params;
  const { organization } = req.user;

  const result = await DesignationServices.deleteteDesignationFromDB(
    designation_id,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Designation deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const DesignationController = {
  createDesignation,
  getSingleDesignation,
  getAllDesignations,
  updateDesignation,
  deleteDesignation,
};
