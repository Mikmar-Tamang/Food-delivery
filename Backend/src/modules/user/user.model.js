import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isBanned: { 
      type: Boolean,
      default: false
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,
    verificationExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;