import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Department } from './department.model';
import { IDepartment } from './department.interface';
import { Organization } from '../organization/organization.model';
import { Employee } from '../employee/employee.model';
// import { User } from '../user/user.model';
const createDepartmentIntoDb = async (
  department: IDepartment,
  organization: string,
) => {
  // todo: 1. check departmentHead's designation is departmentHead
  if (!(await Organization.doesOrganizationExist(organization))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  if (!(await Employee.doesEmployeeExist(department.deparmentHead))) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find department head!',
    );
  }
  department.organization = organization;
  const result = await Department.create(department);
  return result;
};
const getAllDepartmentsFromDb = async (
  userId: string,
  organization_Id: string,
) => {
  //check- User's organization matches the requested's organization (obsolete, cz both are coming from auth)
  // User.isUserAccessDenied(userId, organization_Id);
  // if (await User.isUserAccessDenied(userId, organization_Id)) {
  //   throw new AppError(StatusCodes.NOT_FOUND, 'Access denied!');
  // }

  const departments = await Department.find({ organization: organization_Id });

  return departments;
};
const getSingleDepartmentFromDB = async (
  _id: string,
  organization_Id: string,
) => {
  const department = await Department.doesDepartmentExist(_id, organization_Id);
  if (!department) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find department!');
  }

  return department;
};
const updateDepartmentIntoDB = async (
  _id: string,
  organization_Id: string,

  departmentInfo: Partial<IDepartment>,
) => {
  const department = await Department.doesDepartmentExist(_id, organization_Id);
  if (!department) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find department!');
  }

  const result = await Department.findOneAndUpdate(
    { _id, organization: organization_Id },
    departmentInfo,
    {
      new: true,
    },
  );
  return result;
};
const deleteteDepartmentFromDB = async (
  _id: string,
  organization_Id: string,
) => {
  const department = await Department.doesDepartmentExist(_id, organization_Id);
  if (!department) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find department!');
  }

  const result = await Department.findOneAndUpdate(
    { _id, organization: organization_Id },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const DepartmentServices = {
  createDepartmentIntoDb,
  getAllDepartmentsFromDb,
  getSingleDepartmentFromDB,
  updateDepartmentIntoDB,
  deleteteDepartmentFromDB,
};
