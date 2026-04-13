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

async function getUserAccountsController(req, res) {
  try {
    const accounts = await accountModel.find({ user: req.user._id });
    return res.status(200).json({
      success: true,
      message: "User accounts fetched successfully",
      accounts,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function getUserAccountsBalanceController(req, res) {
  const { accountId } = req.params;
  try {
    if (!accountId) {
      return res.status(404).json({
        message: "AccountId is missing",
      });
    }
    const account = await accountModel.findOne({
      _id: accountId,
      user: req.user._id,
    });
    if (!account) {
      return res.status(404).json({
        message: "AccountId not found",
      });
    }
    const balance = await account.getBalance();
    return res.status(200).json({
      success: true,
      message: "User account balance fetched successfully",
      accountId: accountId,
      balance: balance,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  createAccountController,
  getUserAccountsController,
  getUserAccountsBalanceController,
};
