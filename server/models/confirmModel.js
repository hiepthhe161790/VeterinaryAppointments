const mongoose = require("mongoose");

const confirmSchema = new mongoose.Schema({
  token: { type: String, required: true },
  userID: { type: String, required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
},
{ timestamps: true }
);

module.exports = Confirm = mongoose.model("confirm", confirmSchema);
