const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");

const Schema = mongoose.Schema;

const campGroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// delete middleware
campGroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({ _id: { $in: doc.reviews } });
  }
});

const Campground = mongoose.model("Campground", campGroundSchema);

module.exports = Campground;
