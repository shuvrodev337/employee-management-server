import { TNewUser } from './user.interface';
import { User } from './user.model';

const createEmployeeIntoDB = async (password: string, payload: TNewUser) => {
  console.log(password, payload);
  // const newUser = await User.create(payload);

  return payload;
};
export const UserServices = {
  createEmployeeIntoDB,
};
