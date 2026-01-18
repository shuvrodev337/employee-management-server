import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IEmployee } from './employee.interface';
import { Employee } from './employee.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

const getAllEmployeesFromDB = async () => {
  const employees = await Employee.find();
  return employees;
};
const getSingleEmployeeFromDB = async (_id: string) => {
  const result = await Employee.findById(_id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find employee!');
  }
  return result;
};
const updateEmployeeIntoDB = async (
  _id: string,
  updateData: Partial<IEmployee>,
) => {
  if (!(await Employee.doesEmployeeExist(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find employee!');
  }
  const { name, ...remainingFacultyData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Employee.findByIdAndUpdate(
    { _id, isDeleted: { $ne: true } },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteEmployeeFromDB = async (_id: string) => {
  if (!(await Employee.doesEmployeeExist(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find employee!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedEmployee = await Employee.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedEmployee) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete employee!');
    }
    const user_id = deletedEmployee.user;
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete employee!');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedEmployee;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete employee!',
    );
  }
};

export const EmployeeServices = {
  getAllEmployeesFromDB,
  getSingleEmployeeFromDB,
  updateEmployeeIntoDB,
  deleteEmployeeFromDB,
};
