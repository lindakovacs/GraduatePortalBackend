const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String, 
      required: true
    },
    isGrad: {
      type: Boolean,
      required: true
    },
    expireAt: {
      type: Date,
      default: Date.now,
      // index: { expires: "48h" },
      // TODO: Delete the "1m" option and uncomment "48h" line.
      index: { expires: "1m" },
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TempUser", tempUserSchema);