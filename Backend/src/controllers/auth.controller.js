import User from '../models/user.model.js';
import FoodPartner from '../models/food-partner.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cloudinaryService from '../services/cloudinary.service.js';
import {v4 as uuid} from 'uuid'
import crypto from 'crypto'
import sendEmail from "../services/email.service.js";


const userRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
const email = req.body.email.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    // CASE 1: User already exists
    if (existingUser) {
      // If verified → block
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists" });
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

      return res.status(200).json({
        message: "Verification email resent",
      });
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

    return res.status(201).json({
      message: "Check your email to verify account",
    });

  } catch (err) {
  if (err.code === 11000) {
    return res.status(400).json({ message: "User already exists" });
  }
  return res.status(500).json({ error: err.message });
}
};

// VERIFY EMAIL + AUTO LOGIN
const userVerifyEmail = async (req, res) => {
    try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired link");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    await user.save();

    const jwtToken= jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1d'});

   res.cookie("token", jwtToken, {
  httpOnly: true,
  secure: true, 
  sameSite: "none"
});

    return res.redirect(`${process.env.FRONTEND_URL}`);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// RESEND VERIFICATION
const userResendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.json({ message: "Already verified" });
    }

    const newToken = crypto.randomBytes(32).toString("hex");

    user.verificationToken = newToken;
    user.verificationExpires = Date.now() + 1000 * 60 * 60;

    await user.save();

    const link = `${process.env.FRONTEND_URL}/verify-email?token=${newToken}`;

    await sendEmail(
      email,
      "Resend Verification",
      `<h2>Resend Verification</h2>
       <p>Click below to verify your email:</p>
       <a href="${link}">Verify Email</a>`
    );

    res.json({ message: "Verification email resent" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// LOGIN (optional but recommended)
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
  return res.status(400).json({
    message: "User not found"
  });
}

    if (!user.isVerified) {
  return res.status(400).json({
    message: "Please verify your email first",
    allowResendVerification: true
  });
}

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email and password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

    res.json({ message: "Login successful" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const userLogout = async (req, res) => {
    try {
        res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const foodPartnerRegister = async (req, res) => {
    try{

    const restaurantPp= await cloudinaryService.uploadImage(req.file.buffer,{
        folder: "restaurant-logo",
        fileName: `restaurant-${uuid()}`
    });
    const { name, email, password, restaurantName, restaurantAddress } = req.body;

    const isFoodPartnerExist = await FoodPartner.findOne({ email });
    if (isFoodPartnerExist) {
        return res.status(400).json({ message: "Food partner already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newFoodPartner = await FoodPartner.create({
        name,
        email,
        password: hash,
        restaurantName,
        restaurantAddress,
        restaurantPp:{
            url: restaurantPp.url,
            public_id: restaurantPp.public_id
        }
    });
    

    const token = jwt.sign({id: newFoodPartner._id}, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

    res.status(201).json({
        message: "Food partner registered successfully",
        newFoodPartner: {
            _id: newFoodPartner._id,
            name: newFoodPartner.name,
            email: newFoodPartner.email,
            restaurantAddress: newFoodPartner.restaurantAddress,
            restaurantName: newFoodPartner.restaurantName,
            restaurantPp: newFoodPartner.restaurantPp
        }
    });
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

const foodPartnerLogin = async (req, res) => {
    try {
        const {email, password}= req.body;
        const isFoodPartnerExists= await FoodPartner.findOne({email});
        if(!isFoodPartnerExists) return res.status(400).json({message: "email and password is incorrect"});

        const isPasswordCorrect= await bcrypt.compare(password, isFoodPartnerExists.password);
        if(!isPasswordCorrect) return res.status(400).json({message: "email and password is incorrect"});

        const token= jwt.sign({id: isFoodPartnerExists._id}, process.env.JWT_SECRET, { expiresIn: '1h' });

       res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none"
});

        res.status(200).json({
            message: "Login successful",
            foodPartner: {
                _id: isFoodPartnerExists._id,
                name: isFoodPartnerExists.name,
                email: isFoodPartnerExists.email
            }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const foodPartnerLogout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({
    user: req.user,
  });
};


export default {
    userRegister, userVerifyEmail, userResendVerification, userLogin, userLogout,
    foodPartnerRegister, foodPartnerLogin, foodPartnerLogout,
    getMe};