const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Theme = require("../models/theme");
const passport = require("passport");

// Themes page
router.get("/", async (req, res) => {
  const themes = await Theme.find();
  const name = req.user ? req.user.firstName : "name";
  res.render("themes.ejs", { themes: themes, name: name });
});

module.exports = router;
