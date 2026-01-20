import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Admin } from './admin.model';
import mongoose from 'mongoose';
import { IAdmin } from './admin.interface';
import { User } from '../user/user.model';

const getAllAdminsFromDB = async (organization_Id: string) => {
  const admins = await Admin.find({ organization: organization_Id });
  return admins;
};
const getSingleAdminFromDB = async (_id: string, organization_Id: string) => {
  const result = await Admin.findOne({
    _id,
    organization: organization_Id,
  });
  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find admin!');
  }
  return result;
};
const updateAdminIntoDB = async (_id: string, updateData: Partial<IAdmin>) => {
  const existingAdmin = await Admin.doesAdminExist(_id);
  if (!existingAdmin) {
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
  // alternative approach , get organization _id from params instead of existingEmployee.organization.
  const result = await Admin.findOneAndUpdate(
    {
      _id,
      organization: existingAdmin.organization,
      isDeleted: { $ne: true },
    },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );

  return result;
};

const deleteAdminFromDB = async (_id: string) => {
  const existingAdmin = await Admin.doesAdminExist(_id);

  if (!existingAdmin) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find admin!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedAdmin = await Admin.findByIdAndUpdate(
      { _id, organization: existingAdmin.organization },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedAdmin) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to delete admin!');
    }
    const user_id = deletedAdmin.user;
    const updatedUser = await User.findByIdAndUpdate(
      { _id: user_id, organization: existingAdmin.organization },
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
