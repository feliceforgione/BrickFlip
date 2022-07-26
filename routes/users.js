const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const passport = require("passport");
const methodOverride = require("method-override");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/user/login");
}

function isLoggedOut(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("/user");
  next();
}

// Profile page
router.get("/", isLoggedIn, (req, res) => {
  res.render("user.ejs", { name: req.user.firstName });
});

//-------------- Registration
router.get("/register", isLoggedOut, (req, res) => {
  res.render("register.ejs");
});

// Register a new user
router.post("/register", isLoggedOut, async (req, res) => {
  let newUser = req.body;
  newUser._id = req.body.email;

  try {
    // Check if email already exists
    const user = await User.findOne({ _id: newUser._id });
    if (user) return res.status(403).send("Email already exists");

    // Hash Password
    newUser.password = await hashPassword(newUser.password);

    // Save User
    newUser = new User(newUser);
    const result = await newUser.save();
    console.log(`${result._id} account created`);
    res.redirect("/user/login");
  } catch (error) {
    console.log(error);
    res.redirect("/user/register");
  }
});

async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
}

//-------------- Login

router.post(
  "/login",
  isLoggedOut,
  passport.authenticate("local", {
    successRedirect: "/user",
    failureRedirect: "/user/login",
    failureFlash: true,
  })
);

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login.ejs", { title: "Login" });
});

//-------------- Logout

router.delete("/logout", isLoggedIn, (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/user/login");
  }); // Passport creates this function
});

//--------------------------------------------------

// JWTOKEN Code

/* // Login
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
}); */

/* function authenticateToken(req, res, next) {
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
} */

module.exports = router;
