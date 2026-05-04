import User from "../../user/user.model.js";
import FoodPartner from "../../food-partner/food-partner.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../../../services/email.service.js";
import crypto from "crypto";
import cloudinaryService from "../../../services/cloudinary.service.js";
import { v4 as uuid } from "uuid";

const userRegister = async (body) => {
  try {
    const { username, password } = body;
const email = body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    // CASE 1: User already exists
    if (existingUser) {
      // If verified → block
      if (existingUser.isVerified) {
       throw new Error("User already exists");
      }

      // If NOT verified → update & resend
      const verificationToken = crypto.randomBytes(32).toString("hex");

      existingUser.username = username;
      existingUser.password = await bcrypt.hash(password, 10);
      existingUser.verificationToken = verificationToken;
      existingUser.verificationExpires = Date.now() + 1000 * 60 * 60;

      await existingUser.save();

      const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

      await sendEmail(
        email,
        "Verify your account",
        `<h2>Welcome ${username}</h2>
         <p>Click below to verify your email:</p>
         <a href="${verifyLink}">Verify Email</a>`
      );

      return { message: "Verification email resent" };
    }

    // CASE 2: NEW USER → CREATE HERE
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await User.create({
      username,
      email,
      password: hash,
      verificationToken,
      verificationExpires: Date.now() + 1000 * 60 * 60,
      isVerified: false,
    });

    // const verifyLink = `${process.env.FRONTEND_URL}/api/auth/user/verify-email?token=${verificationToken}`;
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      "Verify your account",
      `<h2>Welcome ${username}</h2>
       <p>Click below to verify your email:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    return { message: "Check your email to verify account" };

  } catch (err) {
    if (err.code === 11000) {
      throw new Error("User already exists");
    }
    throw new Error(err.message);
  }
};

const verifyEmail = async (token) => {
  const user = await User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    const err = new Error("Invalid or expired link");
    err.status = 400;
    throw err;
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpires = undefined;

  await user.save();

  const jwtToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { jwtToken };
};

const resendVerification = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("User not found");
    err.status = 400;
    throw err;
  }

  if (user.isVerified) {
    return { message: "Already verified" };
  }

  const newToken = crypto.randomBytes(32).toString("hex");

  user.verificationToken = newToken;
  user.verificationExpires = Date.now() + 1000 * 60 * 60;

  await user.save();

  const link = `${process.env.FRONTEND_URL}/verify-email?token=${newToken}`;

  await sendEmail(
    email,
    "Resend Verification",
    `<h2>Verify your email</h2>
     <a href="${link}">Click here</a>`
  );

  return { message: "Verification email resent" };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    const err = new Error("User not found");
    err.status = 400;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error("Please verify your email first");
    err.status = 400;
    err.allowResendVerification = true;
    throw err;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 400;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { user, token };
};

const logoutUser = async () => {
  return { message: "Logout successful" };
};

const registerFoodPartner = async (body, file) => {
  const { name, email, password, restaurantName, restaurantAddress } = body;

  const exists = await FoodPartner.findOne({ email });

  if (exists) {
    const err = new Error("Food partner already exists");
    err.status = 400;
    throw err;
  }

  const upload = await cloudinaryService.uploadImage(file.buffer, {
    folder: "restaurant-logo",
    fileName: `restaurant-${uuid()}`
  });

  const hash = await bcrypt.hash(password, 10);

  const partner = await FoodPartner.create({
    name,
    email,
    password: hash,
    restaurantName,
    restaurantAddress,
    restaurantPp: {
      url: upload.url,
      public_id: upload.public_id
    }
  });

  const token = jwt.sign(
    { id: partner._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { partner, token };
};

const loginFoodPartner = async (email, password) => {
  const partner = await FoodPartner.findOne({ email });

  if (!partner) {
    const err = new Error("Invalid credentials");
    err.status = 400;
    throw err;
  }

  const match = await bcrypt.compare(password, partner.password);

  if (!match) {
    const err = new Error("Invalid credentials");
    err.status = 400;
    throw err;
  }

  const token = jwt.sign(
    { id: partner._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { partner, token };
};

const foodPartnerLogout = async () => {
  return { message: "Logout successful" };
};

const getUserMe = async (user) => {
  if (!user) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  return { user };
};

export default {userRegister, verifyEmail, resendVerification,
     loginUser, logoutUser, registerFoodPartner, loginFoodPartner,
      foodPartnerLogout, getUserMe}