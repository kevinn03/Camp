const express = require("express");
const methodOverride = require("method-override");

const path = require("path");
const ejsMate = require("ejs-mate");
const app = express();
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

const { campgroundSchema, reviewSchema } = require("./schemas.js");
//parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const asyncWrapper = require("./utility/asyncWrapper");
const ExpressError = require("./utility/ExpressError");
const mongoose = require("mongoose");

const campgrounds = require("./routes/campground");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/camp");
  console.log("Mongo connection open");
}
const Campground = require("./model/campground");
const Review = require("./model/review");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.use("/campgrounds", campgrounds);

//create review
app.post(
  "/campgrounds/:id/reviews",
  validateReview,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//delete review
app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("port 3000");
});
