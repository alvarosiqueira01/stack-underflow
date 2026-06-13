import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types/user.types';

export interface IUser extends Document {
  email: string;
  username: string;
  passwordHash: string | null;
  role: UserRole;
  reputation: number;
  avatarUrl: string | null;
  bio: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, default: null },
    role: {
      type: String,
      enum: ['new_user', 'user', 'established', 'moderator', 'admin'],
      default: 'new_user',
    },
    reputation: { type: Number, default: 0 },
    avatarUrl: { type: String, default: null },
    bio: { type: String, default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
