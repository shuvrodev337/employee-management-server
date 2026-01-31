import { Schema, model } from 'mongoose';
import { IAttendance } from './attendance.interface';
import AppError from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';

/**
 * Attendance Schema
 * - Single source of truth: User
 * - Role-based reference: Admin / Employee
 * - One attendance per user per day
 */

const attendanceSchema = new Schema<IAttendance>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },

    admin: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    workingHours: {
      type: Number,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        'present',
        'late',
        'half-day',
        'absent',
        'leave',
        'holiday',
        'weekend',
      ],
      required: true,
    },

    isManual: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* -------------------------------- Indexes -------------------------------- */

/**
 * Prevent duplicate attendance for same user on same day
 */
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

/* ---------------------------- Schema Guards ------------------------------- */

/**
 * Prevent admin & employee both being set
 */
attendanceSchema.pre('save', function (next) {
  if (this.admin && this.employee) {
    return next(
      new AppError(
        StatusCodes.BAD_REQUEST,
        'Attendance cannot reference both admin and employee',
      ),
    );
  }

  next();
});
/* -------------------------------- Export --------------------------------- */

export const Attendance = model<IAttendance>('Attendance', attendanceSchema);
