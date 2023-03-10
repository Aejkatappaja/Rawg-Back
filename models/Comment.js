const mongoose = require("mongoose");

const Comment = mongoose.model("Comment", {
  game_id: String,
  game_name: String,
  username: String,
  token: String,
  date: Object,
  review: String,
  count: Number,
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Comment;
