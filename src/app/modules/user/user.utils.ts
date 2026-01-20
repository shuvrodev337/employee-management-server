import { Organization } from '../organization/organization.model';
import { User } from './user.model';

const findLastEmployeeId = async () => {
  // findOne() inherently limits the result to the first document that matches the query.
  // Since the .sort() operation ensures that the latest document is at the top, findOne() retrieves only that document.

  const lastEmployee = await User.findOne(
    {
      role: 'employee',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastEmployee?.id ? lastEmployee.id : undefined;
};
const findLastAdminId = async () => {
  // findOne() inherently limits the result to the first document that matches the query.
  // Since the .sort() operation ensures that the latest document is at the top, findOne() retrieves only that document.

  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id : undefined;
};
const findLastOrganizationAdminId = async () => {
  const lastOrganizationAdmin = await User.findOne(
    {
      role: 'organizationAdmin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastOrganizationAdmin?.id ? lastOrganizationAdmin.id : undefined;
};
const findLastOrganizationId = async () => {
  const lastOrganization = await Organization.findOne(
    {},
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastOrganization?.id ? lastOrganization.id : undefined;
};

export const generateEmployeeId = async () => {
  let currentId = (0).toString();

  const lastEmployeeId = await findLastEmployeeId();

  if (lastEmployeeId) {
    currentId = lastEmployeeId.substring(3);
  }
  const incrementedId = `E-${(Number(currentId) + 1)
    .toString()
    .padStart(4, '0')}`;
  //   'E-' + (Number(currentId) + 1).toString().padStart(4, '0');

  return incrementedId;
};
export const generateAdminId = async () => {
  let currentId = (0).toString();

  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(3);
  }
  const incrementedId = `A-${(Number(currentId) + 1)
    .toString()
    .padStart(4, '0')}`;

  return incrementedId;
};
export const generateOrganizationAdminId = async () => {
  let currentId = (0).toString();

  const lastOrganizationAdminId = await findLastOrganizationAdminId();

  if (lastOrganizationAdminId) {
    currentId = lastOrganizationAdminId.substring(3);
  }
  const incrementedId = `OA-${(Number(currentId) + 1)
    .toString()
    .padStart(4, '0')}`;

  return incrementedId;
};
export const generateOrganizationId = async () => {
  let currentId = (0).toString();

  const lastOrganizationId = await findLastOrganizationId();

  if (lastOrganizationId) {
    currentId = lastOrganizationId.substring(3);
  }
  const incrementedId = `ORG-${(Number(currentId) + 1)
    .toString()
    .padStart(4, '0')}`;

  return incrementedId;
};

// padstart -> string method, 1st param-> number of digits, 2nd param-> will be filled with this, before the string that
// it is applied to. example->
// (0).toString().padStart(4, '0') ---->'0000'
// (1).toString().padStart(4, '0') ---->'0001'
// (10).toString().padStart(4, '0') ---->'0010'
