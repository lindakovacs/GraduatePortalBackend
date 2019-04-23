const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // TODO: Find out why "unique: true" causes an error.
      // unique: true,
      required: true
    },
    password: {
      type: String, 
      required: true
    },
    isAdmin: {
      type: Boolean,
      required: true
    },
    graduateId: { type: mongoose.Schema.Types.ObjectId, ref: "Graduate" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);