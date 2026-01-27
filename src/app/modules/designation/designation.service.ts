import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Organization } from '../organization/organization.model';
import { IDesignation } from './designation.interface';
import { Designation } from './designation.model';
import { Department } from '../department/department.model';
// import { User } from '../user/user.model';
const createDesignationIntoDb = async (
  designation: IDesignation,
  organization: string,
) => {
  //  check organization
  if (designation.organization !== organization) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized!');
  }
  if (!(await Organization.doesOrganizationExist(designation.organization))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  if (
    !(await Department.doesDepartmentExist(
      designation.department,
      designation.organization,
    ))
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find department!');
  }

  //   designation.organization = organization;

  const result = await Designation.create(designation);
  return result;
};
const getAllDesignatiosFromDb = async (
  departmen_Id: string,
  organization_Id: string,
) => {
  const designations = await Designation.find({
    organization: organization_Id,
    department: departmen_Id,
  });

  return designations;
};
const getSingleDesignationFromDB = async (
  _id: string,
  organization_Id: string,
) => {
  const designatoin = await Designation.doesDesignationExist(
    _id,
    organization_Id,
  );
  if (!designatoin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find designatoin!');
  }

  return designatoin;
};
const updateDesignatoinIntoDB = async (
  _id: string,
  organization_Id: string,

  designationInfo: Partial<IDesignation>,
) => {
  const designatoin = await Designation.doesDesignationExist(
    _id,
    organization_Id,
  );
  if (!designatoin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find designatoin!');
  }

  const result = await Designation.findOneAndUpdate(
    { _id, organization: organization_Id },
    designationInfo,
    {
      new: true,
    },
  );
  return result;
};
const deleteteDesignationFromDB = async (
  _id: string,
  organization_Id: string,
) => {
  const designatoin = await Designation.doesDesignationExist(
    _id,
    organization_Id,
  );
  if (!designatoin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find designatoin!');
  }
  const result = await Designation.findOneAndUpdate(
    { _id, organization: organization_Id },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const DesignationServices = {
  createDesignationIntoDb,
  getAllDesignatiosFromDb,
  getSingleDesignationFromDB,
  updateDesignatoinIntoDB,
  deleteteDesignationFromDB,
};
