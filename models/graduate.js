const mongoose = require("mongoose");

const graduateSchema = new mongoose.Schema({
  firstName: { type: String, default: "", required: true },
  lastName: { type: String, default: "", required: true },
  isActive: { type: Boolean, default: true, required: true },
  phone: { type: String, default: ""},
  story: { type: String, default: ""},
  yearOfGrad: { type: String, default: "", required: true },
  resume: { type: String, default: ""},
  image: { type: String, default: ""},
  links: {
    email: { type: String, default: ""},
    github: { type: String, default: ""},
    linkedin: { type: String, default: ""},
    website: { type: String, default: ""},
  },
  skills: [{ type: String, default: "" }], // arrays automatically default to []
  // TODO: make userId required?
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Graduate", graduateSchema);