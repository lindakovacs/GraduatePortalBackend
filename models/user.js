const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
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
    passwordResetToken: {
      type: String,
      default: ""
    },
    isGrad: {
      type: Boolean,
      required: true
    },
    graduate: { type: mongoose.Schema.Types.ObjectId, ref: "Graduate" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
