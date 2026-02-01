import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AttendanceServices } from './attendance.service';

const createAttendance = catchAsync(async (req, res) => {
  const attendance = req.body;
  const { organization } = req.user;
  const result = await AttendanceServices.createAttendanceIntoDB(
    attendance,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Attendance created successfully',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const checkOutAttendance = catchAsync(async (req, res) => {
  const checkOutData = req.body;
  const { organization } = req.user;
  const result = await AttendanceServices.checkOutAttendanceFromDB(
    checkOutData,
    organization,
  );
  sendResponse(res, {
    success: true,
    message: 'Attendance checkOut successful',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});
const deleteAttendance = catchAsync(async (req, res) => {
  const { _id: attendance_Id } = req.params;
  const { userId: deletedByUserId, organization: organization_Id } = req.user;
  const result = await AttendanceServices.deleteAttendanceFromDB(
    attendance_Id,
    deletedByUserId,
    organization_Id,
  );
  sendResponse(res, {
    success: true,
    message: 'Attendance delete successful',
    sttatusCode: StatusCodes.OK,
    data: result,
  });
});

export const AttendanceController = {
  createAttendance,
  checkOutAttendance,
  deleteAttendance,
};
