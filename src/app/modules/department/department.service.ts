import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Department } from './department.model';
import { IDepartment } from './department.interface';
import { Organization } from '../organization/organization.model';
import { Employee } from '../employee/employee.model';
import { Admin } from '../admin/admin.model';
// import { User } from '../user/user.model';
const createDepartmentIntoDb = async (
  department: IDepartment,
  organization: string,
) => {
  // todo: 1. check departmentHead's designation is departmentHead
  if (!(await Organization.doesOrganizationExist(organization))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  // if (!(await Employee.doesEmployeeExist(department.deparmentHead))) {
  //   throw new AppError(
  //     StatusCodes.NOT_FOUND,
  //     'Failed to find department head!',
  //   );
  // }
  department.organization = organization;
  const result = await Department.create(department);
  return result;
};
const getAllDepartmentsFromDb = async (organization_Id: string) => {
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

  // check update info is valid ,
  if (
    departmentInfo.organization &&
    !(await Organization.doesOrganizationExist(departmentInfo.organization))
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  if (
    departmentInfo.deparmentHead &&
    !(await Employee.doesEmployeeExist(departmentInfo.deparmentHead))
  ) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find department head!',
    );
  }
  //
  const result = await Department.findOneAndUpdate(
    { _id, organization: organization_Id },
    departmentInfo,
    {
      new: true,
    },
  );
  return result;
};
const assignDepartmentHeadIntoDB = async (
  _id: string,
  organization_Id: string,

  departmentInfo: Partial<IDepartment>,
) => {
  const department = await Department.doesDepartmentExist(_id, organization_Id);
  if (!department) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find department!');
  }

  // check update info is valid ,
  //In case of HR department, an Admin can be assigned as departmentHead, that's why double check
  const isDepartmentHeadEmployee =
    departmentInfo.deparmentHead &&
    (await Employee.doesEmployeeExist(departmentInfo.deparmentHead));
  const isDepartmentHeadAdmin =
    departmentInfo.deparmentHead &&
    (await Admin.doesAdminExist(departmentInfo.deparmentHead));
  if (!isDepartmentHeadEmployee && !isDepartmentHeadAdmin) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find department head!',
    );

    // if (
    //   departmentInfo.deparmentHead &&
    //   !(await Employee.doesEmployeeExist(departmentInfo.deparmentHead))
    // ) {
    //   throw new AppError(
    //     StatusCodes.NOT_FOUND,
    //     'Failed to find department head!',
    //   );
    // }
  }
  //
  const result = await Department.findOneAndUpdate(
    { _id, organization: organization_Id },
    { deparmentHead: departmentInfo.deparmentHead },
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
  assignDepartmentHeadIntoDB,
};
