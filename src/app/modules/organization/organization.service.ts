import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Organization } from '../organization/organization.model';
import { IOrganization } from './organization.interface';
import mongoose from 'mongoose';
import { OrganizationAdmin } from '../organizationAdmin/organizationAdmin.model';

const getAllOrganizationsFromDb = async () => {
  const organizations = await Organization.find().populate('organizationAdmin');

  return organizations;
};
const getSingleOrganizationFromDB = async (_id: string) => {
  const organization =
    await Organization.findById(_id).populate('organizationAdmin');
  if (!organization) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }

  return organization;
};
// const updateOrganizationIntoDB = async (
//   _id: string,
//   organizationAdmin_userId: string,

//   organizationInfo: Partial<IOrganization>,
// ) => {
//   //check organization exist
//   const organization = await Organization.doesOrganizationExist(_id);
//   if (!organization) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
//   }
//   //check organizationAdmin exist
//   const organizationAdmin = await OrganizationAdmin.findOne({
//     id: organizationAdmin_userId,
//   });
//   if (!organizationAdmin) {
//     throw new AppError(
//       StatusCodes.NOT_FOUND,
//       'Failed to find organization admin!',
//     );
//   }
//   //check- organizationAdmin from auth is actually the requested organization's OrganizationAdmin

//   if (
//     organization.organizationAdmin &&
//     !organization.organizationAdmin.equals(organizationAdmin._id)
//   ) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'Access denied!');
//   }

//   //
//   const {organizationName , organizationEmail,organizationAddress,organizationContactNo} = organizationInfo
//   const session = await mongoose.startSession();

//   try {
//     session.startTransaction();

//     //  Update organization
//     const updatedOrganization = await Organization.findOneAndUpdate(

//     { _id },
//     organizationInfo,

//       { new: true, runValidators: true, session },
//     );

//     if (!updatedOrganization) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to update organization!');
//     }

//     //  Update organizationAdmin
//     if (organizationName ||  organizationEmail|| organizationAddress|| organizationContactNo) {
//       const updatedOrganizationAdmin = await OrganizationAdmin.findOneAndUpdate(
//         {
//           _id: organizationAdmin._id,
//           organization: _id,
//           isDeleted: { $ne: true },
//         },
//         { organizationName , organizationEmail,organizationAddress,organizationContactNo},
//         { new: true, runValidators: true, session },
//       );

//       if (!updatedOrganizationAdmin) {
//         throw new AppError(
//           StatusCodes.BAD_REQUEST,
//           'Failed to update Organization admin!',
//         );
//       }
//     }

//     await session.commitTransaction();
//     await session.endSession();

//     return updatedEmployee;
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();

//     throw new AppError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to update employee!',
//     );
//   }

//   //
//   const result = await Organization.findOneAndUpdate(
//     { _id },
//     organizationInfo,
//     {
//       new: true,
//     },
//   );
//   return result;
// };
const updateOrganizationIntoDB = async (
  _id: string,
  organizationAdmin_userId: string,
  organizationInfo: Partial<IOrganization>,
) => {
  // 1. Check organization exists
  const organization = await Organization.doesOrganizationExist(_id);
  if (!organization) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }

  // 2. Check organization admin exists
  const organizationAdmin = await OrganizationAdmin.findOne({
    id: organizationAdmin_userId,
    isDeleted: { $ne: true },
  });

  if (!organizationAdmin) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find organization admin!',
    );
  }

  // 3. Authorization check
  if (
    organization.organizationAdmin &&
    !organization.organizationAdmin.equals(organizationAdmin._id)
  ) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 4. Update Organization
    const updatedOrganization = await Organization.findOneAndUpdate(
      { _id },
      organizationInfo,
      { new: true, runValidators: true, session },
    );

    if (!updatedOrganization) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Failed to update organization!',
      );
    }

    // 5. Update OrganizationAdmin (only synced fields)
    const adminUpdatePayload: Record<string, unknown> = {};

    if (organizationInfo.organizationName) {
      adminUpdatePayload.organizationName = organizationInfo.organizationName;
    }
    if (organizationInfo.organizationEmail) {
      adminUpdatePayload.organizationEmail = organizationInfo.organizationEmail;
    }
    if (organizationInfo.organizationAddress) {
      adminUpdatePayload.organizationAddress =
        organizationInfo.organizationAddress;
    }
    if (organizationInfo.organizationContactNo) {
      adminUpdatePayload.organizationContactNo =
        organizationInfo.organizationContactNo;
    }

    if (Object.keys(adminUpdatePayload).length > 0) {
      const updatedOrganizationAdmin = await OrganizationAdmin.findOneAndUpdate(
        {
          _id: organizationAdmin._id,
          organization: _id,
          isDeleted: { $ne: true },
        },
        adminUpdatePayload,
        { new: true, runValidators: true, session },
      );

      if (!updatedOrganizationAdmin) {
        throw new AppError(
          StatusCodes.BAD_REQUEST,
          'Failed to update organization admin!',
        );
      }
    }

    await session.commitTransaction();
    await session.endSession();

    return updatedOrganization;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update organization!',
    );
  }
};

const deleteteOrganizationFromDB = async (
  _id: string,
  organizationAdmin_userId: string,
) => {
  //check organization exist
  const organization = await Organization.doesOrganizationExist(_id);
  if (!organization) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Failed to find organization!');
  }
  const organizationAdmin = await OrganizationAdmin.findOne({
    id: organizationAdmin_userId,
  });
  if (!organizationAdmin) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Failed to find organization admin!',
    );
  }
  //check- organizationAdmin from auth is actually the requested organization's OrganizationAdmin

  if (
    organization.organizationAdmin &&
    !organization.organizationAdmin.equals(organizationAdmin._id)
  ) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Access denied!');
  }

  const result = await Organization.findOneAndUpdate(
    { _id },
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const OrganizationServices = {
  getAllOrganizationsFromDb,
  getSingleOrganizationFromDB,
  updateOrganizationIntoDB,
  deleteteOrganizationFromDB,
};
