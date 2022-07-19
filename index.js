const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const Theme = require("./models/theme.js");

// Create express server
const app = express();
const PORT = process.env.PORT;

// Connect to database
mongoose
  .connect(
    `mongodb+srv://${process.env.MongoUser}:${process.env.password}@${process.env.MongoAtlasURL}/${process.env.MongoDB}?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB ", err));

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
  //res.send("Welcome to Lego Marketplace");
  const themes = await Theme.find({});
  res.json(themes);
});

// Listen
app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT}`);
});
