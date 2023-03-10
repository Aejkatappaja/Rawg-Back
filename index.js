const express = require("express");
const app = express();

const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const mongoose = require("mongoose");
mongoose.connect(`${process.env.MONGODB_URI}`);

const user = require("./routes/User");
const home = require("./routes/HomeGame");
const favorites = require("./routes/Favorites");
const comments = require("./routes/Comments");

app.use(express.json());
app.use(cors());

app.use(user);
app.use(home);
app.use(favorites);
app.use(comments);

app.get("/", (req, res) => {
  res.json({ message: "Welcome on my Server !" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Wrong way dude !" });
});

app.listen(process.env.PORT, () => {
  console.log(" --------> Server started 🚀 ");
});
