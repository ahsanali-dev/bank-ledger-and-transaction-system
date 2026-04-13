const { default: mongoose, model } = require("mongoose");

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, "Token is required to blacklist"],
      unique: [true, "token is already blacklisted"],
    },
    blacklisted: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

tokenBlacklistSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 60 * 60 * 24 * 3, // 3 days
  },
);

const tokenBlacklistModel = mongoose.model(
  "tokenBlackList",
  tokenBlacklistSchema,
);

module.exports = tokenBlacklistModel;
