const accountModel = require("../models/account.model");

/**
 * Create a new transaction
 *
 * THE 10-STEP TRANSACTION FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransaction(req, res) {
  /**
   * 1. Validate Request
   */
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (fromAccount || toAccount || amount || idempotencyKey) {
    return res.status(400).json({
      message: "FromAccount, ToAccount, Amount, idempotencyKey is required",
    });
  }
  const isFromAccountExist = await accountModel.findOne({
    _id: fromAccount,
  });

  const isToAccountExist = await accountModel.findOne({
    _id: toAccount,
  });
  if (!isFromAccountExist || !isToAccountExist) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }
  
}
