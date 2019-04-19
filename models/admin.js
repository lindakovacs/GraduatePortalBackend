const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Admin", adminSchema);