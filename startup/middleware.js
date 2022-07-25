const express = require("express");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");

module.exports = (app) => {
  //Views
  app.set("view-engine", "ejs");

  // Middleware
  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(flash());
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(methodOverride("_method"));
};
