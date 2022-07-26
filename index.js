const express = require("express");
require("dotenv").config();
const passport = require("passport");
const userRoutes = require("./routes/users.js");

// Create express server
const app = express();
const PORT = process.env.PORT;

// Connect to database
require("./startup/db.js")();

//Middleware
require("./startup/middleware")(app);

//Passport
require("./startup/passport-config")(passport);

// Routes
app.get("/", async (req, res) => {
  //res.send("Welcome to Lego Marketplace");
  //const themes = await Theme.find({});
  console.log("session", req.session);
  //console.log("sessionID", req.sessionID);
  //console.log("req.user", req.user);
  res.render("index.ejs", { title: "Login" });
});

app.use("/user", userRoutes);

// Listen
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
