const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

// Register Authentication ****************************************************
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.AES_PASS_SECRET
    ).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

// Login USER Authentication ************************************************
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json("Oops!!! Check your username and try again");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.AES_PASS_SECRET
    );

    const InitialPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (InitialPassword !== req.body.password) {
      res.status(401).json("Oops!!! Check your password and try again");
      return;
    }

    //   JWT TOKEN GEN ******************************
    const accessToken = jwt.sign(
      {
        id: user._id,
        isEmployee: user.isEmployee,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "3d" }
    );

    const { password, ...other } = user._doc;

    res.status(200).json({ ...other, accessToken });
    return;
  } catch (err) {
    res.status(500).json(err, "Oops!!! Invalid username or password");
    return;
  }
});
module.exports = router;
