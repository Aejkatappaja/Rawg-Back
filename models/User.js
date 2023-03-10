const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: String,
  username: String,
  token: String,
  hash: String,
  salt: String,
  favorites: { type: Array, default: null },
  comments: { type: Array, default: null },
  avatar: { type: Object, default: null },
});

module.exports = User;
