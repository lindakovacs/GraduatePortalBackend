const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const graduateSchema = new Schema(
  {
    firstName: { type: String, default: "", required: true },
    lastName: { type: String, default: "", required: true },
    isActive: { type: Number, default: 1, required: true },
    phone: { type: String, default: ""},
    story: { type: String, default: ""},
    yearOfGrad: { type: String, default: "", required: true },
    resume: { type: String, default: ""},
    image: { type: String, default: ""},
    // TODO: Refactor links to not be nested? Would require front-end refactoring too.
    email: { type: String, default: ""},
    links: {
      github: { type: String, default: ""},
      linkedin: { type: String, default: ""},
      website: { type: String, default: ""},
    },
    skills: [{ type: String, default: "" }], // arrays automatically default to []
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
);

module.exports = mongoose.model("Graduate", graduateSchema);