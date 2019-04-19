const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    username: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    graduate: { type: mongoose.Schema.Types.ObjectId, ref: "Graduate" },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "Employer" }
  },
});

module.exports = mongoose.model("User", userSchema);