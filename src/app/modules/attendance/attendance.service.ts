import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Attendance } from './attendance.model';
import { User } from '../user/user.model';
import {
  IAttendance,
  TAttendanceQuery,
  TCreateAttendancePayload,
} from './attendance.interface';
import { Admin } from '../admin/admin.model';
import { Employee } from '../employee/employee.model';

/**
 * Create Attendance (Check-in)
 */
// const createAttendanceIntoDB = async (
//   payload: TCreateAttendancePayload,
//   organization_Id: string,
// ) => {
//   /* ----------------------------- Step 1: User ----------------------------- */
//   const user = await User.findById(payload.user);

//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
//   }
//   //check- employee/admin's organization matches the auth's organization
//   if (!user.organization.equals(organization_Id)) {
//     throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
//   }

//   /* ----------------------------- Step 2: Role ----------------------------- */
//   if (user.role !== 'admin' && user.role !== 'employee') {
//     throw new AppError(
//       StatusCodes.FORBIDDEN,
//       'Only admin or employee can give attendance',
//     );
//   }

//   /* ------------------------- Step 3: Normalize Date ------------------------ */
//   const attendanceDate = new Date(payload.date);
//   attendanceDate.setHours(0, 0, 0, 0);

//   /* ------------------------ Step 4: Duplicate Check ------------------------ */
//   const existingAttendance = await Attendance.findOne({
//     user: user._id,
//     date: attendanceDate,
//     isDeleted: false,
//   });

//   if (existingAttendance) {
//     throw new AppError(
//       StatusCodes.CONFLICT,
//       'Attendance already exists for this date',
//     );
//   }

//   /* ------------------------- Step 5: Build Payload ------------------------- */
//   const attendanceData: Partial<IAttendance> = {
//     user: user._id,
//     organization: user.organization,
//     date: attendanceDate,
//     checkIn: payload.checkIn ?? new Date(),
//     isManual: payload.isManual ?? false,
//     remarks: payload.remarks,
//     status: 'present',
//     isDeleted: false,
//   };

//   /* ----------------------- Step 6: Role-based Ref -------------------------- */
//   if (user.role === 'admin') {
//     const admin = await Admin.findOne({ user: user._id });

//     if (!admin) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'Admin profile not found');
//     }

//     attendanceData.admin = admin._id;
//   }

//   if (user.role === 'employee') {
//     const employee = await Employee.findOne({ user: user._id });

//     if (!employee) {
//       throw new AppError(StatusCodes.NOT_FOUND, 'Employee profile not found');
//     }

//     attendanceData.employee = employee._id;
//   }

//   /* ----------------------------- Step 7: Save ------------------------------ */
//   const attendance = await Attendance.create(attendanceData);

//   return attendance;
// };
const createAttendanceIntoDB = async (
  payload: TCreateAttendancePayload,
  organization_Id: string,
) => {
  /* ----------------------------- Step 1: User ----------------------------- */
  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  /* ----------- Step 1.1: Organization Access Check (IMPORTANT) ------------ */
  if (!user.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  /* ----------------------------- Step 2: Role ----------------------------- */
  if (user.role !== 'admin' && user.role !== 'employee') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Only admin or employee can give attendance',
    );
  }

  /* ---------------------- Step 3: Resolve Check-in ------------------------- */
  const checkInTime = payload.checkIn ? new Date(payload.checkIn) : new Date();

  /* ------------------------- Step 4: Normalize Date ------------------------ */
  const attendanceDate = new Date(checkInTime);
  attendanceDate.setUTCHours(0, 0, 0, 0);

  /* ------------------------ Step 5: Duplicate Check ------------------------ */
  const existingAttendance = await Attendance.findOne({
    user: user._id,
    date: attendanceDate,
    isDeleted: false,
  });

  if (existingAttendance) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'Attendance already exists for this date',
    );
  }

  /* ------------------------- Step 6: Build Payload ------------------------- */
  const attendanceData: Partial<IAttendance> = {
    user: user._id,
    organization: user.organization,
    date: attendanceDate,
    checkIn: checkInTime,
    isManual: payload.isManual ?? false,
    remarks: payload.remarks,
    status: 'present',
    isDeleted: false,
  };

  /* ----------------------- Step 7: Role-based Ref -------------------------- */
  if (user.role === 'admin') {
    const admin = await Admin.findOne({ user: user._id });

    if (!admin) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Admin profile not found');
    }

    attendanceData.admin = admin._id;
  }

  if (user.role === 'employee') {
    const employee = await Employee.findOne({ user: user._id });

    if (!employee) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Employee profile not found');
    }

    attendanceData.employee = employee._id;
  }

  /* ----------------------------- Step 8: Save ------------------------------ */
  const attendance = await Attendance.create(attendanceData);

  return attendance;
};

/**
 * Check-out Attendance
 */
// const checkOutAttendanceFromDB = async (payload: {
//   user: string;
//   date: Date;
//   checkOut?: Date;
// }) => {
//   const user = await User.findById(payload.user);

//   if (!user) {
//     throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
//   }

//   const attendance = await Attendance.findOne({
//     user: user._id,
//     date: payload.date,
//     isDeleted: false,
//   });

//   if (!attendance) {
//     throw new AppError(
//       StatusCodes.NOT_FOUND,
//       'Attendance not found for this date',
//     );
//   }

//   if (attendance.checkOut) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Check-out already done');
//   }

//   const checkOutTime = payload.checkOut ?? new Date();

//   /* ----------------------- Working Hours Calculation ----------------------- */
//   if (attendance.checkIn) {
//     const diff = checkOutTime.getTime() - attendance.checkIn.getTime();

//     attendance.workingHours = Number((diff / (1000 * 60 * 60)).toFixed(2));
//   }

//   attendance.checkOut = checkOutTime;

//   /* ----------------------------- Status Logic ------------------------------ */
//   if (attendance.workingHours !== undefined) {
//     if (attendance.workingHours < 4) {
//       attendance.status = 'half-day';
//     } else {
//       attendance.status = 'present';
//     }
//   }

//   await attendance.save();
//   return attendance;
// };
/**
 * Check-out Attendance
 */
const checkOutAttendanceFromDB = async (
  payload: {
    user: string;
    checkOut?: Date;
    remarks?: string;
  },
  organization_Id: string,
) => {
  /* ----------------------------- Step 1: User ----------------------------- */
  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  /* --------------------- Step 1.1: Organization Check --------------------- */
  if (!user.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  /* ----------------------------- Step 2: Role ----------------------------- */
  if (user.role !== 'admin' && user.role !== 'employee') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Only admin or employee can check out',
    );
  }

  /* ---------------------- Step 3: Resolve Check-out ------------------------ */
  const checkOutTime = payload.checkOut
    ? new Date(payload.checkOut)
    : new Date();

  /* ---------------------- Step 4: Normalize Date (UTC) --------------------- */
  const attendanceDate = new Date(checkOutTime);
  attendanceDate.setUTCHours(0, 0, 0, 0);

  /* ---------------------- Step 5: Find Attendance -------------------------- */
  const attendance = await Attendance.findOne({
    user: user._id,
    date: attendanceDate,
    isDeleted: false,
  });

  if (!attendance) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Attendance not found for today');
  }

  /* --------------------- Step 6: Validation Guards ------------------------- */
  if (!attendance.checkIn) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Check-in not found');
  }

  if (attendance.checkOut) {
    throw new AppError(StatusCodes.CONFLICT, 'Already checked out');
  }

  /* ------------------- Step 7: Working Hours Calculation ------------------- */
  const diffMs = checkOutTime.getTime() - attendance.checkIn.getTime();

  if (diffMs <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid check-out time');
  }

  const workingHours = Number((diffMs / (1000 * 60 * 60)).toFixed(2));

  /* ------------------------- Step 8: Update Data --------------------------- */
  attendance.checkOut = checkOutTime;
  attendance.workingHours = workingHours;

  if (payload.remarks) {
    attendance.remarks = payload.remarks;
  }

  /* ----------------------------- Step 9: Save ------------------------------ */
  await attendance.save();

  return attendance;
};

/**
 * Soft Delete Attendance
 */
/**
 * Delete (Soft) Attendance
 */
const deleteAttendanceFromDB = async (
  attendance_Id: string,
  deletedByUserId: string,
  organization_Id: string,
) => {
  /* ----------------------------- Actor check----------------------------- */
  const actor = await User.findOne({ id: deletedByUserId });

  if (!actor) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  /* ----------------------Organization Check ---------------------- */
  if (!actor.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  /* --------------------------Attendance ---------------------------- */
  const attendance = await Attendance.findById(attendance_Id);
  if (!attendance || attendance.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Attendance not found');
  }

  /* ---------------------- Same Organization ----------------------- */
  if (!attendance.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  /* -------------------------  Guard Rules ---------------------------- */
  if (!attendance.checkIn) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid attendance record');
  }

  /* --------------------------- Soft Delete -------------------------- */
  attendance.isDeleted = true;

  await attendance.save();

  return attendance;
};

const getAttendanceByUserFromDB = async (
  user_Id: string,
  query: TAttendanceQuery,
  organization_Id: string,
) => {
  /* ----------------------------- Step 1: User ----------------------------- */
  const user = await User.findById(user_Id);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  if (!user.organization.equals(organization_Id)) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Access denied!');
  }

  /* --------------------------- Step 2: Pagination -------------------------- */
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  /* ----------------------------- Step 3: Filter ---------------------------- */
  const filter: any = {
    user: user._id,
    organization: organization_Id,
    isDeleted: false,
  };

  // Date range filter
  if (query.startDate || query.endDate) {
    filter.date = {};

    if (query.startDate) {
      const start = new Date(query.startDate);
      start.setHours(0, 0, 0, 0);
      filter.date.$gte = start;
    }

    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }

  // Status filter
  if (query.status) {
    filter.status = query.status;
  }

  /* ----------------------------- Step 4: Query ----------------------------- */
  const attendances = await Attendance.find(filter)
    .populate('employee')
    .populate('admin')
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Attendance.countDocuments(filter);

  /* ----------------------------- Step 5: Meta ------------------------------ */
  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: attendances,
  };
};

export default getAttendanceByUserFromDB;

/* -------------------------------------------------------------------------- */

export const AttendanceServices = {
  createAttendanceIntoDB,
  checkOutAttendanceFromDB,
  deleteAttendanceFromDB,
};
