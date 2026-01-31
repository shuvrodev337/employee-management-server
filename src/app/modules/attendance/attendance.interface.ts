import { Types } from 'mongoose';

export type TAttendanceStatus =
  | 'present'
  | 'late'
  | 'half-day'
  | 'absent'
  | 'leave'
  | 'holiday'
  | 'weekend';
export interface IAttendance {
  user: Types.ObjectId;

  employee?: Types.ObjectId;
  admin?: Types.ObjectId;

  organization: Types.ObjectId;
  date: Date;

  checkIn?: Date;
  checkOut?: Date;

  workingHours?: number;
  status: TAttendanceStatus;

  isManual: boolean;
  remarks?: string;
  isDeleted: boolean;
}
export type TCreateAttendancePayload = {
  user: string;
  date: Date;
  checkIn?: Date;
  isManual?: boolean;
  remarks?: string;
};
// font-end will send -> 'user' of admin/employee ( _id of that admin/employee in User model)
// in service-> create attendance steps :
// 1. find that admin/employee in User model
// 2. check role of that user
// 3. set admin or employee value according to their role, set organization from the user
