const express = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");
const {
  createAccountController,
  getUserAccountsController,
  getUserAccountsBalanceController,
} = require("../controllers/account.controller");

const router = express.Router();

/**
 * - POST /api/accounts/
 * - Create a new account
 */
router.post("/", authMiddleware, createAccountController);

/**
 * - Get /api/accounts
 * - Get all accounts of the logged-in user
 * - Protected Routes
 */
router.get("/", authMiddleware, getUserAccountsController);

/**
 * - GET /api/accounts/balance/:accountId
 * - Get user accounts balance of the logged-in user
 * - Protected Routes
 */
router.get(
  "/balance/:accountId",
  authMiddleware,
  getUserAccountsBalanceController,
);

module.exports = router;
