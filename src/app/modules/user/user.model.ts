import { model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { UserStatus } from './user.constant';
import bcrypt from 'bcrypt';
import config from '../../config';
const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'employee', 'organizationAdmin'],
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
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

// mongodb middlewares

// hash password
userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
//static methods
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select('+password');
};

userSchema.statics.isUserBlocked = async function (id: string) {
  const user = await User.findOne({ id }).select('+password');
  if (user?.status === 'blocked') {
    return true;
  }
  return false;
};
userSchema.statics.isUserDeleted = async function (id: string) {
  const user = await User.findOne({ id }).select('+password');

  return user?.isDeleted;
};
userSchema.statics.isUserAccessDenied = async function (
  id: string,
  accessRequestedOrganization_id: string,
) {
  const user = await User.findOne({ id }).select('+password');
  //check- User requested organization matches the user's organization
  const accessDenied = user?.organization.equals(
    accessRequestedOrganization_id,
  );
  console.log({ accessDenied });
  return accessDenied;
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};
userSchema.statics.isPasswordChangedAfterJWTissued = function (
  passwordChangedAt,
  jwtIssuedAt,
) {
  // Purpose of this method is to invalidate a token after password change.
  const passwordChangedTime = new Date(passwordChangedAt).getTime() / 1000;

  return passwordChangedTime > jwtIssuedAt;
};

export const User = model<IUser, UserModel>('User', userSchema);
