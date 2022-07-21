const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");

router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.post("/", async (req, res) => {
  let newUser = {
    _id: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    hashedPassword: req.body.hashedPassword,
    billingAddress: {
      street1: req.body.billingAddress.street1,
      street2: req.body.billingAddress.street2,
      city: req.body.billingAddress.city,
      state: req.body.billingAddress.state,
      zipcode: req.body.billingAddress.zipcode,
    },
    shippingAddress: {
      street1: req.body.shippingAddress.street1,
      street2: req.body.shippingAddress.street2,
      city: req.body.shippingAddress.city,
      state: req.body.shippingAddress.state,
      zipcode: req.body.shippingAddress.zipcode,
    },
  };

  // query database
  try {
    // Check if email alrady exists
    const user = await User.find({ _id: newUser._id });
    if (user) return res.status(403).send("Email already exists");

    // Hash Password
    newUser.hashedPassword = await hashPassword(newUser.hashedPassword);
    console.log(newUser.hashedPassword);

    // Save User
    newUser = new User(newUser);
    const result = await newUser.save();
    res.json(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
});

async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

// AUTHENTICATION
router.post("/login", async (req, res) => {
  try {
    // Check if email  exists
    const user = await User.findOne({ _id: req.body.email });
    if (!user) return res.status(400).send("Login Incorrect");

    // Check Password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.hashedPassword
    );

    if (!validPassword) return res.status(400).send("Login Incorrect");

    // Create Web Token
    const payload = { userID: user._id };
    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET);

    res.status(200).json({ accessToken: accessToken });
  } catch (ex) {
    console.log(ex);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // this is set in the header manually as "Authorization" = `Bearer tokenHere`
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send("Not authorized");

  //verify token
  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    // user if coming from the payload
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

module.exports = router;
