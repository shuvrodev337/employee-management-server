import { Admin } from './admin.model';

const getAllAdminsFromDB = async () => {
  const admins = await Admin.find();
  return admins;
};

export const AdminServices = {
  getAllAdminsFromDB,
};
