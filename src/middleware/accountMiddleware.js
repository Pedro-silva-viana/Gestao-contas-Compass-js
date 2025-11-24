const Account = require("../models/Account");

async function checkAccountOpen(req, res, next) {
  try {
    const accountId = req.params.accountId || req.body.accountId;

    if (!accountId) {
      return res.status(400).json({ error: "Account ID is required" });
    }

    const account = await Account.findById(accountId);

    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (account.open_f === true) {
      return next();
    }

    return res.status(403).json({ 
      error: "Operation not allowed. Account is closed." 
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = checkAccountOpen;