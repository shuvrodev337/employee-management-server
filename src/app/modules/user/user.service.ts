import mongoose from 'mongoose';
import config from '../../config';
import { TNewAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { TNewEmployee } from '../employee/employee.interface';
import { Employee } from '../employee/employee.model';
import { TNewUser } from './user.interface';
import { User } from './user.model';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import {
  generateAdminId,
  generateEmployeeId,
  generateOrganizationAdminId,
  generateOrganizationId,
} from './user.utils';
import { TNewOrganizationAdmin } from '../organizationAdmin/organizationAdmin.interface';
import { TNewOrganization } from '../organization/organization.interface';
import { Organization } from '../organization/organization.model';
import { OrganizationAdmin } from '../organizationAdmin/organizationAdmin.model';

const createEmployeeIntoDB = async (
  password: string,
  employeeData: TNewEmployee,
) => {
  //check if organizatonexists
  const existingOrganization =
    employeeData.organization &&
    (await Organization.doesOrganizationExist(employeeData.organization));

  if (!existingOrganization) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Organization does not exist!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // create user
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'employee';
    userData.email = employeeData.email;

    userData.id = await generateEmployeeId();
    userData.organization = employeeData.organization;

    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    // create employee

    employeeData.id = newUser[0].id;
    employeeData.user = newUser[0]._id;
    //dates are taken as string from http request but  saved as Date objects to DB.
    employeeData.dateOfBirth =
      employeeData.dateOfBirth && new Date(employeeData.dateOfBirth);
    employeeData.joiningDate =
      employeeData.joiningDate && new Date(employeeData.joiningDate);

    const newEmployee = await Employee.create([employeeData], { session });
    if (!newEmployee.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create employee!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newEmployee;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create Employee!',
    );
  }
};
const createAdminIntoDB = async (password: string, adminData: TNewAdmin) => {
  //check if organizatonexists
  const existingOrganization =
    adminData.organization &&
    (await Organization.doesOrganizationExist(adminData.organization));

  if (!existingOrganization) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Organization does not exist!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // create user
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'admin';
    userData.email = adminData.email;

    userData.id = await generateAdminId();
    userData.organization = adminData.organization;

    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    // create admin

    adminData.id = newUser[0].id;
    adminData.user = newUser[0]._id;
    adminData.dateOfBirth =
      adminData.dateOfBirth && new Date(adminData.dateOfBirth);
    adminData.joiningDate =
      adminData.joiningDate && new Date(adminData.joiningDate);
    const newAdmin = await Admin.create([adminData], { session });
    if (!newAdmin.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin!');
    }
    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create Admin!',
    );
  }
};

const createOrganizationAdminIntoDB = async (
  password: string,
  organizationAdminData: TNewOrganizationAdmin,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    //create Organization
    const organizationData: TNewOrganization = {};
    organizationData.id = await generateOrganizationId();
    organizationData.organizationName = organizationAdminData.organizationName;
    organizationData.organizationEmail =
      organizationAdminData.organizationEmail;
    organizationData.organizationAddress =
      organizationAdminData.organizationAddress;
    organizationData.organizationContactNo =
      organizationAdminData.organizationContactNo;
    const newOrganization = await Organization.create([organizationData], {
      session,
    });
    if (!newOrganization.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to create organization!',
      );
    }

    // create user
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'organizationAdmin';
    userData.email = organizationAdminData.email;
    userData.organization = newOrganization[0]._id;

    userData.id = await generateOrganizationAdminId();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }

    // create organizationAdmin

    organizationAdminData.id = newUser[0].id;
    organizationAdminData.user = newUser[0]._id;
    organizationAdminData.organization = newOrganization[0]._id;
    organizationAdminData.dateOfBirth =
      organizationAdminData.dateOfBirth &&
      new Date(organizationAdminData.dateOfBirth);
    organizationAdminData.joiningDate =
      organizationAdminData.joiningDate &&
      new Date(organizationAdminData.joiningDate);
    const newOrganizationAdmin = await OrganizationAdmin.create(
      [organizationAdminData],
      { session },
    );
    if (!newOrganizationAdmin.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to create organization admin!',
      );
    }

    //set organizationAdmin's _id as the value of organizationAdmin of newOrganization
    const updatedOrganization = await Organization.findByIdAndUpdate(
      newOrganization[0]._id,
      {
        organizationAdmin: newOrganizationAdmin[0]._id,
      },
      { session },
    );
    if (!updatedOrganization) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to update organization with organization admin!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return newOrganizationAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to create organization and organization admin!',
    );
  }
};

export const UserServices = {
  createEmployeeIntoDB,
  createAdminIntoDB,
  createOrganizationAdminIntoDB,
};
