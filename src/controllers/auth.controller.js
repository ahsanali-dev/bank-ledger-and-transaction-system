const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

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
    await emailService.sendRegisterionEmail(user.email, user.name);
    return res.status(201).json({
      success: true,
      message: "User created successfuly",
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

module.exports = { userRegisterController, userLoginController };
