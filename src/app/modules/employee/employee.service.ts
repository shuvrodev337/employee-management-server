import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { IEmployee } from './employee.interface';
import { Employee } from './employee.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

const getAllEmployeesFromDB = async (organization_Id: string) => {
  const employees = await Employee.find({ organization: organization_Id });

  return employees;
};
const getSingleEmployeeFromDB = async (
  _id: string,
  organization_Id: string,
) => {
  const employee = await Employee.findOne({
    _id,
    organization: organization_Id,
  });
  if (!employee) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find employee!');
  }
  //check- OrganizationAdmin's organization matches the employee's organization
  if (!employee.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Access denied!');
  }
  return employee;
};
// const updateEmployeeIntoDB = async (
//   _id: string,
//   organization_Id: string,
//   updateData: Partial<IEmployee>,
// ) => {
//   const existingEmployee = await Employee.doesEmployeeExist(_id);

//   if (!existingEmployee) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find employee!');
//   }

//   if (!existingEmployee.organization.equals(organization_Id)) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Access denied!');
//   }
//   const { name, ...remainingFacultyData } = updateData;

//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...remainingFacultyData,
//   };

//   if (name && Object.keys(name).length) {
//     for (const [key, value] of Object.entries(name)) {
//       modifiedUpdatedData[`name.${key}`] = value;
//     }
//   }

//   const updatedEmployee = await Employee.findOneAndUpdate(
//     {
//       _id,
//       organization: existingEmployee.organization,
//       isDeleted: { $ne: true },
//     },
//     modifiedUpdatedData,
//     { new: true, runValidators: true },
//   );

//   return updatedEmployee;
// };
const updateEmployeeIntoDB = async (
  _id: string,
  organization_Id: string,
  updateData: Partial<IEmployee>,
) => {
  const existingEmployee = await Employee.doesEmployeeExist(_id);

  if (!existingEmployee) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Employee not found!');
  }

  if (!existingEmployee.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const { name, email, ...remainingEmployeeData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingEmployeeData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //  Update Employee
    const updatedEmployee = await Employee.findOneAndUpdate(
      {
        _id,
        organization: existingEmployee.organization,
        isDeleted: { $ne: true },
      },
      {
        ...modifiedUpdatedData,
        ...(email ? { email } : {}),
      },
      { new: true, runValidators: true, session },
    );

    if (!updatedEmployee) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update employee!');
    }

    //  Update User email (if provided)
    if (email) {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: updatedEmployee.user,
          organization: existingEmployee.organization,
          isDeleted: { $ne: true },
        },
        { email },
        { new: true, runValidators: true, session },
      );

      if (!updatedUser) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'Failed to update user email!',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return updatedEmployee;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update employee!',
    );
  }
};

const deleteEmployeeFromDB = async (_id: string, organization_Id: string) => {
  const existingEmployee = await Employee.doesEmployeeExist(_id);
  if (!existingEmployee) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find employee!');
  }
  if (!existingEmployee.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Access denied!');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedEmployee = await Employee.findOneAndUpdate(
      { _id, organization: existingEmployee.organization },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedEmployee) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete employee!');
    }
    const user_id = deletedEmployee.user;
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id, organization: existingEmployee.organization },
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
