const express = require("express");
const router = express.Router();

const Member = require("../models/User");

router.post("/favorites", async (req, res) => {
  const { token } = req.body;
  try {
    const User = await Member.findOne({ token: token });
    const favorites = User.favorites;
    res.status(200).json(favorites);
  } catch (error) {
    res.status(406).json({ message: error });
  }
});

router.put("/add-favorite", async (req, res) => {
  const { favorite, token } = req.body;
  try {
    const User = await Member.findOne({
      token: token,
    });

    // CHOOSE ARRAY IN MODEL
    const favoriteArray = User.favorites;

    if (favoriteArray.length === 0) {
      User.favorites.push(favorite);
      User.save();
    } else {
      const pushing = () => {
        User.favorites.push(favorite);
        User.save();
      };
      const isFound = favoriteArray.some((element) => {
        if (element.id === favorite.id) {
          return true;
        }
      });
      isFound ? null : pushing();
    }
  } catch (error) {
    res.status(406).json({ message: error });
  }
});

router.put("/delete-favorite", async (req, res) => {
  const { gameId, token } = req.body;

  try {
    const User = await Member.findOne({ token: token });
    const favorites = User.favorites;
    favorites.splice(
      favorites.findIndex((a) => a.id === gameId),
      1
    );
    User.save();
    res.status(200).json(favorites);
  } catch (error) {
    res.status(406).json({ message: error });
  }
});

module.exports = router;
