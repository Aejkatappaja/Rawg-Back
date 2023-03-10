const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const BASE64 = require("crypto-js/enc-base64");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/register", fileUpload(), async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let avatar = null;
    if (req.files?.picture) {
      avatar = req.files.picture;
    }
    const emailAlreadyExists = await User.findOne({ email: email });
    const usernameAlreadyExists = await User.findOne({ username: username });
    if (!email && !username) {
      return res
        .status(406)
        .send({ message: "username and/or email are missing !" });
    } else if (emailAlreadyExists) {
      return res
        .status(406)
        .send({ message: "An account whith this e-mail already exists" });
    } else if (usernameAlreadyExists) {
      return res.status(406).send({ message: "Username already taken !" });
    } else if (!password) {
      return res.status(406).send({ message: "You must create a password !" });
    } else {
      const salt = uid2(16);
      const hash = SHA256(salt + password).toString(BASE64);
      const token = uid2(64);

      const newUser = new User({
        email: email,
        username: username,
        token: token,
        hash: hash,
        salt: salt,
        avatar: avatar,
      });

      console.log(User);

      if (avatar) {
        const result = await cloudinary.uploader.upload(
          convertToBase64(req.files.picture),
          {
            folder: `rawg/avatar/${newUser._id}`,
          }
        );
        newUser.avatar = result;
      }
      await newUser.save();

      const validUser = {
        id: newUser._id,
        token: newUser.token,
        email: newUser.email,
        username: newUser.username,
        avatar: newUser.avatar.secure_url,
      };

      res.status(200).json(validUser);
    }
  } catch (error) {
    console.log(error);
    res.status(406).json({ message: error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const newHash = SHA256(user.salt + password).toString(encBase64);
    if (newHash !== user.hash) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.avatar) {
      var avatar = "unexist"; // ou un autre nom de fichier pour l'avatar par défaut
    } else {
      var avatar = user.avatar;
    }

    res.status(200).json({
      _id: user._id,
      token: user.token,
      username: user.username,
      email: user.email,
      avatar: avatar.secure_url,
    });
  } catch (error) {
    res.status(400).json({ message: error });
    console.log(error.message);
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const Member = await User.findOne({ token: token });

    let avatarUrl = "";
    if (Member.avatar) {
      avatarUrl = Member.avatar.secure_url;
    } else {
      avatarUrl = "unexist";
    }

    const UserInfos = {
      Username: Member.username,
      Email: Member.email,
      Avatar: avatarUrl,
    };
    res.status(200).json(UserInfos);
  } catch (error) {
    console.log(error.message);
    res.status(406).json({ message: error });
  }
});

module.exports = router;
