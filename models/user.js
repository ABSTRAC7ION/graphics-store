const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String },
  password: { type: String },
  description: { type: String },
  fullName: { type: String },
  email: String,
  age: Number,
  like: Array,
  creations: { type: Array, default: [] },
});
module.exports = mongoose.model("User", userSchema);
