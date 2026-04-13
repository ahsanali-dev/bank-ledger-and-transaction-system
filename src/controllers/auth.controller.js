const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const tokenBlacklistModel = require("../models/blackList.model");

/**
 * - user register controller
 * - POST /api/auth/register
 */
async function userRegisterController(req, res) {
  const { email, name, password } = req.body;
  try {
    const isEmailExist = await userModel.findOne({ email: email });
    if (isEmailExist) {
      return res.status(422).json({
        success: false,
        message: "User is already exist",
      });
    }
    const user = await userModel.create({
      email,
      password,
      name,
    });
    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      },
    );
    res.cookie("token", token);
    await emailService.sendRegistrationEmail(user.email, user.name);
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * - user login controller
 * - POST /api/auth/login
 */
async function userLoginController(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email or Password is INVALID",
      });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Email or Password is INVALID",
      });
    }
    const token = await jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      },
    );
    res.cookie("token", token);
    return res.status(200).json({
      success: true,
      message: "User login successfuly",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

/**
 * - POST /api/auth/logout
 * - User logout Api
 */
async function userLogoutController(req, res) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res.status(200).json({
        message: "User logged out successfully",
      });
    }
    res.clearCookie("token");

    await tokenBlacklistModel.create({
      token: token,
    });
    return res.status(200).json({
      message: "User logout successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  userRegisterController,
  userLoginController,
  userLogoutController,
};
