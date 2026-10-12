const mongoose = require("mongoose");

const GradeSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    grade: { type: String, trim: true },
    score: { type: Number },
  },
  { _id: false },
);

const RestaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    cuisine: {
      type: String,
      required: [true, "Cuisine is required"],
      trim: true,
    },
    borough: {
      type: String,
      required: [true, "Borough is required"],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 0,
      max: 5,
      default: 0,
    },
    image: { type: String, trim: true, default: "" },
    address: {
      building: { type: String, trim: true },
      street: { type: String, trim: true },
      zipcode: { type: String, trim: true },
      coord: [Number],
    },
    grades: [GradeSchema],
    restaurant_id: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Restaurant", RestaurantSchema, "restaurants");
