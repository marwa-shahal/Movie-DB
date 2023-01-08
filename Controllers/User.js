require("dotenv").config();
const { Router } = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = Router();

//DESTRUCTURE ENV VARIABLES WITH DEFAULTS
const { SECRET = "secret" } = process.env;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({username:req.body.username, password:req.body.password});
    res.json(user);
  } catch (error) {
    console.log("hey")
    res.status(400).json({ error });
  }
});

// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (user) {
        const result = await bcrypt.compare(req.body.password, user.password);
        if (result) {
          const token = await jwt.sign({ username: user.username }, SECRET);
          res.json({ token });
        } else {
          res.status(400).json({ error: "password doesn't match" });
        }
      } else {
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      res.status(400).json({ error });
    }
  });
  
  module.exports = router