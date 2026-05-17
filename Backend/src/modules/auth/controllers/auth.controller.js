import authService from '../services/auth.service.js';

const RegisterUser = async (req, res) => {
  try {
    const result = await authService.userRegister(req.body);
    res.status(201).json({ 
      success: true, 
      message: result.message,
      email: result.email 
    });
  } catch (error) {
    console.error('registration error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

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
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });

    res.json({ message: "Logout successful" });

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