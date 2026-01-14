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
import { generateAdminId, generateEmployeeId } from './user.utils';

const createEmployeeIntoDB = async (
  password: string,
  employeeData: TNewEmployee,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // create user
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'employee';
    userData.email = employeeData.email;

    userData.id = await generateEmployeeId();

    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    // create employee

    employeeData.id = newUser[0].id;
    employeeData.user = newUser[0]._id;

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
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // create user
    const userData: TNewUser = {};
    userData.password = password || config.default_pass;
    userData.role = 'admin';
    userData.email = adminData.email;

    userData.id = await generateAdminId();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
    }
    // create admin

    adminData.id = newUser[0].id;
    adminData.user = newUser[0]._id;
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
export const UserServices = {
  createEmployeeIntoDB,
  createAdminIntoDB,
};
