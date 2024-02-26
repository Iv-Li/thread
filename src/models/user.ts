import mongoose, { Types } from "mongoose";

interface IUser {
  authId: string
  username: string
  name: string
  image: string
  bio: string
  threads: Types.ObjectId[]
  onboarded: Boolean
  communities: Types.ObjectId[]
}

const userSchema = new mongoose.Schema<IUser>({
  authId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User = mongoose.models?.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", userSchema);

export default User;