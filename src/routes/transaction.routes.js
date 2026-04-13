const { Router } = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const transactions = require("../controllers/transaction.controller");

const transactionRoutes = Router();

/**
 * - POST /api/transaction/
 * - Create a new transaction
 */

transactionRoutes.post(
  "/",
  authMiddleware.authMiddleware,
  transactions.createTransaction,
);

/**
 * - POST /api/transaction/system/initial-funds
 * - Create initial funds transform from system user
 */
transactionRoutes.post(
  "/system/initial-funds",
  authMiddleware.authSystemUserMiddleware,
  transactions.createInitialTransaction
);

module.exports = transactionRoutes;
