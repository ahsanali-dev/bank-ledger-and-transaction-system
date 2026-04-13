const { Router } = require("express");
const { authMiddleware } = require("../middleware/auth.middleware");

const transactionRoutes = Router();

/**
 * - POST /api/transaction/
 * - Create a new transaction
 */

transactionRoutes.post("/", authMiddleware);

module.exports = transactionRoutes;
