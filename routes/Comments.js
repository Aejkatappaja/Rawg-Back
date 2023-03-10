const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Comment = require("../models/Comment");
const Member = require("../models/User");

router.post("/comments", async (req, res) => {
  const { game_id } = req.body;
  try {
    const review = await Comment.find({ game_id: game_id });
    res.status(200).json(review);
  } catch (error) {
    res.status(406).json({ message: error });
  }
});

router.post("/publish-comment", async (req, res) => {
  const { game_id, game_name, game_img, username, token, date, review } =
    req.body;
  try {
    const alreadyCommented = await Comment.findOne({
      token: token,
      game_id: game_id,
    });
    if (alreadyCommented) {
      return res
        .status(406)
        .json({ message: "You already commented this game !" });
    } else {
      const newComment = new Comment({
        game_id: game_id,
        game_name: game_name,
        game_img: game_img,
        username: username,
        token: token,
        date: date,
        review: review,
      });
      await newComment.save();

      const User = await Member.findOne({ token: token });
      const reviewsArray = User.comments;

      reviewsArray.push({
        game_id: game_id,
        game_name: game_name,
        game_img: game_img,
        username: username,
        token: token,
        date: date,
        review: review,
      });
      User.save();

      const validComment = {
        id: newComment._id,
        game_id: game_id,
        username: username,
        token: token,
        date: date,
        review: review,
      };
      res.status(200).json(validComment);
    }
  } catch (error) {
    console.log(error);
    res.status(406).json({ message: error });
  }
});

router.put("/delete-comment", async (req, res) => {
  const { game_id, token } = req.body;
  try {
    const User = await Member.findOne({
      token: token,
    });
    const reviewsArray = User.comments;

    reviewsArray.splice(
      reviewsArray.findIndex((a) => a.game_id === game_id),
      1
    );

    await Comment.findOneAndDelete({
      token: token,
      game_id: game_id,
    });

    User.save();
    res.status(200).json(reviewsArray);
  } catch (error) {
    res.status(406).json({ message: error });
  }
});

router.put("/thumbs-comment/", async (req, res) => {
  const { action, id } = req.body;

  try {
    let increment = 0;
    if (action === "increment") {
      increment = 1;
    } else if (action === "decrement") {
      increment = -1;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    const comment = await Comment.findOneAndUpdate(
      { _id: id },
      { $inc: { count: increment } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(406).json({ message: error });
  }
});
module.exports = router;
