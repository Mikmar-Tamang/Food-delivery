import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  verificationToken: String,
  verificationExpires: Date

}, { timestamps: true });

const User = mongoose.model("user", userSchema);

export default User;