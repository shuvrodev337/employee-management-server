// import mongoose from 'mongoose';
// import { TNewOrganizationAdmin } from './organizationAdmin.interface';
// import { TNewUser } from '../user/user.interface';
// import config from '../../config';
// import {
//   generateOrganizationAdminId,
//   generateOrganizationId,
// } from '../user/user.utils';
// import { User } from '../user/user.model';
// import AppError from '../../errors/AppError';
// import { StatusCodes } from 'http-status-codes';
// import { OrganizationAdmin } from './organizationAdmin.model';
// import { TNewOrganization } from '../organization/organization.interface';
// import { Organization } from '../organization/organization.model';

// const createOrganizationAdminIntoDB = async (
//   password: string,
//   organizationAdminData: TNewOrganizationAdmin,
// ) => {
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();

//     //create Organization
//     const organizationData: TNewOrganization = {};
//     organizationData.id = await generateOrganizationId();
//     organizationData.organizationName = organizationAdminData.organizationName;
//     organizationData.organizationEmail =
//       organizationAdminData.organizationEmail;
//     organizationData.organizationAddress =
//       organizationAdminData.organizationAddress;
//     organizationData.organizationContactNo =
//       organizationAdminData.organizationContactNo;

//     const newOrganization = await Organization.create([organizationData], {
//       session,
//     });
//     if (!newOrganization.length) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Failed to create organization!',
//       );
//     }
//     // create user
//     const userData: TNewUser = {};
//     userData.password = password || config.default_pass;
//     userData.role = 'organizationAdmin';
//     userData.email = organizationAdminData.email;
//     userData.organization = newOrganization[0]._id;

//     userData.id = await generateOrganizationAdminId();
//     const newUser = await User.create([userData], { session });
//     if (!newUser.length) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create user!');
//     }
//     // create organizationAdmin

//     organizationAdminData.id = newUser[0].id;
//     organizationAdminData.user = newUser[0]._id;
//     organizationAdminData.organization = newOrganization[0]._id;
//     organizationAdminData.dateOfBirth =
//       organizationAdminData.dateOfBirth &&
//       new Date(organizationAdminData.dateOfBirth);
//     organizationAdminData.joiningDate =
//       organizationAdminData.joiningDate &&
//       new Date(organizationAdminData.joiningDate);
//     const newOrganizationAdmin = await OrganizationAdmin.create(
//       [organizationAdminData],
//       { session },
//     );
//     if (!newOrganizationAdmin.length) {
//       throw new AppError(StatusCodes.BAD_REQUEST, 'Failed to create admin!');
//     }
//     //set organizationAdmin's _id as the value of organizationAdmin of newOrganization
//     const updatedOrganization = await Organization.findByIdAndUpdate(
//       newOrganization[0]._id,
//       {
//         organizationAdmin: newOrganizationAdmin[0]._id,
//       },
//       { session },
//     );
//     if (!updatedOrganization) {
//       throw new AppError(
//         StatusCodes.BAD_REQUEST,
//         'Failed to update organization with organizationAdmin!',
//       );
//     }
//     await session.commitTransaction();
//     await session.endSession();
//     return newOrganizationAdmin;
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw new AppError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to create Admin!',
//     );
//   }
// };
