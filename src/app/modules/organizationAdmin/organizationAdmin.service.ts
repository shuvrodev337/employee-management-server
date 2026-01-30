import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { OrganizationAdmin } from './organizationAdmin.model';
import { IOrganizationAdmin } from './organizationAdmin.interface';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Organization } from '../organization/organization.model';

const getAllOrganizationAdminsFromDB = async () => {
  const organizationAdmins = await OrganizationAdmin.find();

  return organizationAdmins;
};
const getSingleOrganizationFromDB = async (_id: string) => {
  const organizationAdmin = await OrganizationAdmin.findById(_id);
  if (!organizationAdmin) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find organizationAdmin!',
    );
  }

  return organizationAdmin;
};

const updateOrganizationAdminIntoDB = async (
  _id: string,
  organization_Id: string,
  updateData: Partial<IOrganizationAdmin>,
) => {
  const organizationAdmin = await OrganizationAdmin.findById(_id);
  if (!organizationAdmin) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find organizationAdmin!',
    );
  }

  if (!organizationAdmin.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }
  if (!(await Organization.doesOrganizationExist(organization_Id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  const { name, email, ...remainingOrganizationAdminData } = updateData;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingOrganizationAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //  Update OrganizationAdmin
    const updatedOrganizationAdmin = await OrganizationAdmin.findOneAndUpdate(
      {
        _id,
        organization: organizationAdmin.organization,
        isDeleted: { $ne: true },
      },
      {
        ...modifiedUpdatedData,
        ...(email ? { email } : {}),
      },
      { new: true, runValidators: true, session },
    );

    if (!updatedOrganizationAdmin) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to update organizationAdmin!',
      );
    }

    //  Update User email (if provided)
    if (email) {
      const updatedUser = await User.findOneAndUpdate(
        {
          _id: updatedOrganizationAdmin.user,
          organization: organizationAdmin.organization,
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

    return updatedOrganizationAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update Organization Admin!',
    );
  }
};
const deleteOrganizationAdminFromDB = async (
  _id: string,
  organization_Id: string,
) => {
  const organizationAdmin = await OrganizationAdmin.findById(_id);
  if (!organizationAdmin) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find organizationAdmin!',
    );
  }

  if (!organizationAdmin.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }
  if (!(await Organization.doesOrganizationExist(organization_Id))) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedOrganizationAdmin = await OrganizationAdmin.findOneAndUpdate(
      { _id, organization: organizationAdmin.organization },
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedOrganizationAdmin) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to delete organizationAdmin!',
      );
    }
    const user_id = deletedOrganizationAdmin.user;
    const updatedUser = await User.findOneAndUpdate(
      { _id: user_id, organization: organizationAdmin.organization },
      { isDeleted: true },
      { new: true, session },
    );
    if (!updatedUser) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to delete organizationAdmin!',
      );
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedOrganizationAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to delete organizationAdmin!',
    );
  }
};
export const OrganizationAdminServices = {
  getAllOrganizationAdminsFromDB,
  getSingleOrganizationFromDB,
  updateOrganizationAdminIntoDB,
  deleteOrganizationAdminFromDB,
};
