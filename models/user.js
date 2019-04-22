const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
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

userSchema.methods.updateGraduate = async function(data) {

};

module.exports = mongoose.model("User", userSchema);