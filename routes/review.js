const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utility/asyncWrapper");
const ExpressError = require("../utility/ExpressError");
const Review = require("../model/review");
const Campground = require("../model/campground");

const { reviewSchema } = require("../schemas.js");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//create review
router.post(
  "/",
  validateReview,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//delete review
router.delete(
  "/:reviewId",
  asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Deleted review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
