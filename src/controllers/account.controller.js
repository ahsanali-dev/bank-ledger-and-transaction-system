const accountModel = require("../models/account.model");

async function createAccountController(req, res) {
  const user = req.user;
  try {
    const account = await accountModel.create({
      user: user._id,
    });
    res.status(201).json({
      success: true,
      account,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = { createAccountController };
