const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employerSchema = new Schema(
  {
    company: { type: String, default: "", required: true },
    logo: { type: String, default: "", required: true },
    firstName: { type: String, default: "", required: true },
    lastName: { type: String, default: "", required: true },
    isActive: { type: Boolean, default: true, required: true },
    email: { type: String, default: ""},
    website: { type: String, default: ""},
    favorites: [{ type: String, default: [] }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", employerSchema);