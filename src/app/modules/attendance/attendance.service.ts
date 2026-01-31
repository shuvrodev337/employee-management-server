import { StatusCodes } from 'http-status-codes';
import AppError from '../../errors/AppError';
import { Attendance } from './attendance.model';
import { User } from '../user/user.model';
import { IAttendance, TCreateAttendancePayload } from './attendance.interface';
import { Admin } from '../admin/admin.model';
import { Employee } from '../employee/employee.model';

/**
 * Create Attendance (Check-in)
 */
const createAttendanceIntoDB = async (payload: {
  user: string;
  date: Date;
  checkIn?: Date;
  isManual?: boolean;
  remarks?: string;
}) => {
  /* ----------------------------- Step 1: User ----------------------------- */
  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  /* ----------------------------- Step 2: Role ----------------------------- */
  if (user.role !== 'admin' && user.role !== 'employee') {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'Only admin or employee can give attendance',
    );
  }

  /* ------------------------- Step 3: Normalize Date ------------------------ */
  const attendanceDate = new Date(payload.date);
  attendanceDate.setHours(0, 0, 0, 0);

  /* ------------------------ Step 4: Duplicate Check ------------------------ */
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

  /* ------------------------- Step 5: Build Payload ------------------------- */
  const attendanceData: Partial<IAttendance> = {
    user: user._id,
    organization: user.organization,
    date: attendanceDate,
    checkIn: payload.checkIn ?? new Date(),
    isManual: payload.isManual ?? false,
    remarks: payload.remarks,
    status: 'present',
    isDeleted: false,
  };

  /* ----------------------- Step 6: Role-based Ref -------------------------- */
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

  /* ----------------------------- Step 7: Save ------------------------------ */
  const attendance = await Attendance.create(attendanceData);

  return attendance;
};

/**
 * Check-out Attendance
 */
const checkOutAttendanceFromDB = async (payload: {
  user: string;
  date: Date;
  checkOut?: Date;
}) => {
  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found!');
  }

  const attendance = await Attendance.findOne({
    user: user._id,
    date: payload.date,
    isDeleted: false,
  });

  if (!attendance) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Attendance not found for this date',
    );
  }

  if (attendance.checkOut) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Check-out already done');
  }

  const checkOutTime = payload.checkOut ?? new Date();

  /* ----------------------- Working Hours Calculation ----------------------- */
  if (attendance.checkIn) {
    const diff = checkOutTime.getTime() - attendance.checkIn.getTime();

    attendance.workingHours = Number((diff / (1000 * 60 * 60)).toFixed(2));
  }

  attendance.checkOut = checkOutTime;

  /* ----------------------------- Status Logic ------------------------------ */
  if (attendance.workingHours !== undefined) {
    if (attendance.workingHours < 4) {
      attendance.status = 'half-day';
    } else {
      attendance.status = 'present';
    }
  }

  await attendance.save();
  return attendance;
};

/**
 * Soft Delete Attendance
 */
const deleteAttendanceFromDB = async (attendanceId: string) => {
  const attendance = await Attendance.findById(attendanceId);

  if (!attendance || attendance.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Attendance not found');
  }

  attendance.isDeleted = true;
  await attendance.save();

  return attendance;
};

/* -------------------------------------------------------------------------- */

export const AttendanceServices = {
  createAttendanceIntoDB,
  checkOutAttendanceFromDB,
  deleteAttendanceFromDB,
};
