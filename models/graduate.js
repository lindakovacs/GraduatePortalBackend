const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const graduateSchema = new Schema(
  {
    firstName: { type: String, default: "", required: true },
    lastName: { type: String, default: "", required: true },
    isActive: { type: Boolean, default: true, required: true },
    phone: { type: String, default: ""},
    story: { type: String, default: ""},
    yearOfGrad: { type: String, default: "", required: true },
    resume: { type: String, default: ""},
    links: {
      github: { type: String, default: ""},
      linkedin: { type: String, default: ""},
      website: { type: String, default: ""},
    },
    skills: [{ type: String, default: [] }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Graduate", graduateSchema);