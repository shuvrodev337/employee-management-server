import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Admin } from './admin.model';
import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import { User } from '../user/user.model';

const getAllAdminsFromDB = async () => {
  const admins = await Admin.find();
  return admins;
};
const getSingleAdminFromDB = async (_id: string) => {
  const result = await Admin.findById(_id);
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find admin!');
  }
  return result;
};
const updateAdminIntoDB = async (_id: string, updateData: Partial<IAdmin>) => {
  if (!(await Admin.doesAdminExist(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find admin!');
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

  const result = await Admin.findByIdAndUpdate(
    { _id, isDeleted: { $ne: true } },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteAdminFromDB = async (_id: string) => {
  if (!(await Admin.doesAdminExist(_id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find admin!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      _id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete admin!');
    }
    const user_id = deletedAdmin.user;
    const updatedUser = await User.findByIdAndUpdate(
      user_id,
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete admin!');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete admin!',
    );
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
