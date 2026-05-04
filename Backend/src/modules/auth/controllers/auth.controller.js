import authService from '../services/auth.service.js';

// const userRegister = async (req, res) => {
//   try {
//     const { username, password } = req.body;
// const email = req.body.email.trim().toLowerCase();

//     const existingUser = await User.findOne({ email });

//     // CASE 1: User already exists
//     if (existingUser) {
//       // If verified → block
//       if (existingUser.isVerified) {
//         return res.status(400).json({ message: "User already exists" });
//       }

//       // If NOT verified → update & resend
//       const verificationToken = crypto.randomBytes(32).toString("hex");

//       existingUser.username = username;
//       existingUser.password = await bcrypt.hash(password, 10);
//       existingUser.verificationToken = verificationToken;
//       existingUser.verificationExpires = Date.now() + 1000 * 60 * 60;

//       await existingUser.save();

//       const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

//       await sendEmail(
//         email,
//         "Verify your account",
//         `<h2>Welcome ${username}</h2>
//          <p>Click below to verify your email:</p>
//          <a href="${verifyLink}">Verify Email</a>`
//       );

//       return res.status(200).json({
//         message: "Verification email resent",
//       });
//     }

//     // CASE 2: NEW USER → CREATE HERE
//     const hash = await bcrypt.hash(password, 10);
//     const verificationToken = crypto.randomBytes(32).toString("hex");

//     await User.create({
//       username,
//       email,
//       password: hash,
//       verificationToken,
//       verificationExpires: Date.now() + 1000 * 60 * 60,
//       isVerified: false,
//     });

//     // const verifyLink = `${process.env.FRONTEND_URL}/api/auth/user/verify-email?token=${verificationToken}`;
//     const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

//     await sendEmail(
//       email,
//       "Verify your account",
//       `<h2>Welcome ${username}</h2>
//        <p>Click below to verify your email:</p>
//        <a href="${verifyLink}">Verify Email</a>`
//     );

//     return res.status(201).json({
//       message: "Check your email to verify account",
//     });

//   } catch (err) {
//   if (err.code === 11000) {
//     return res.status(400).json({ message: "User already exists" });
//   }
//   return res.status(500).json({ error: err.message });
// }
// };

// VERIFY EMAIL + AUTO LOGIN

const RegisterUser = async (req, res)=> {
  try {
    const createUser= await authService.userRegister(req.body);
    res.status(201).json({ message: "User registered successfully", user: createUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const userVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const { jwtToken } = await authService.verifyEmail(token);

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    return res.redirect(process.env.FRONTEND_URL);

  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// RESEND VERIFICATION
const userResendVerification = async (req, res) => {
  try {
    const result = await authService.resendVerification(req.body.email);
    res.json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// LOGIN (optional but recommended)
const userLogin = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.json({
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message,
      allowResendVerification: error.allowResendVerification
    });
  }
};

const userLogout = async (req, res) => {
  try {
    const result = await authService.logoutUser();

    res.clearCookie("token");

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const foodPartnerRegister = async (req, res) => {
  try {
    const { partner, token } = await authService.registerFoodPartner(req.body, req.file);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.status(201).json({
      message: "Food partner registered successfully",
      partner
    });

  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const foodPartnerLogin = async (req, res) => {
  try {
    const { partner, token } = await authService.loginFoodPartner(
      req.body.email,
      req.body.password
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.json({
      message: "Login successful",
      partner
    });

  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

const foodPartnerLogout = async (req, res) => {
  try {
    const result = await authService.foodPartnerLogout();

    res.clearCookie("token");

    res.status(200).json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const result = await authService.getUserMe(req.user);

    res.status(200).json(result);

  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message
    });
  }
};


export default {
    RegisterUser, userVerifyEmail, userResendVerification, userLogin, userLogout,
    foodPartnerRegister, foodPartnerLogin, foodPartnerLogout,
    getMe};