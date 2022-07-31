const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user: { type: String, required: true },
  price: { type: Number, required: true },
  iamge: { type: String, required: true },
});

// Create Model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = User;
