import mongoose from 'mongoose';

interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', userSchema);