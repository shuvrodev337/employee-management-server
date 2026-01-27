import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { DepartmentServices } from './department.service';

const createDepartment = catchAsync(async (req, res) => {
  const department = req.body;
  const { organization } = req.user;
  const result = await DepartmentServices.createDepartmentIntoDb(
    department,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: ' department created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getAllDepartments = catchAsync(async (req, res) => {
  const { userId, organization } = req.user;
  const result = await DepartmentServices.getAllDepartmentsFromDb(
    userId,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Departments retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const getSingleDepartment = catchAsync(async (req, res) => {
  const { _id: department_id } = req.params;
  const { organization } = req.user;

  const result = await DepartmentServices.getSingleDepartmentFromDB(
    department_id,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Department retrieved successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const updateDepartment = catchAsync(async (req, res) => {
  const { _id: department_id } = req.params;
  const { organization } = req.user;
  const departmentInfo = req.body;

  const result = await DepartmentServices.updateDepartmentIntoDB(
    department_id,
    organization,
    departmentInfo,
  );
  sendResponse(res, {
    success: true,
    message: 'Department updated successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const deleteDepartment = catchAsync(async (req, res) => {
  const { _id: department_id } = req.params;
  const { organization } = req.user;

  const result = await DepartmentServices.deleteteDepartmentFromDB(
    department_id,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Department deleted successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
export const DepartmentController = {
  createDepartment,
  getSingleDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
};
