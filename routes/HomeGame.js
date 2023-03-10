const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

router.get("/home", async (req, res) => {
  const pageSize = req.query.page_size || "";
  const page = req.query.page || 1;
  const search = req.query.search || "";
  const order = req.query.order || "";
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games?key=${process.env.RAWG_KEY}&page_size=${pageSize}&search=${search}&page=${page}&ordering=${order}`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/details", async (req, res) => {
  const id = req.query.id;
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${id}?key=${process.env.RAWG_KEY}`
    );
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/slug", async (req, res) => {
  const slug = req.query.slug;
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${slug}/game-series?key=${process.env.RAWG_KEY}`
    );
    res.status(200).json(response.data);
    console.log(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
