const express = require("express");
const router = express.Router({ mergeParams: true });
const asyncWrapper = require("../utility/asyncWrapper");

const reviews = require("../controllers/review");

const {
  validateReview,
  isLoggedIn,

  isReviewAuthor,
} = require("../middleware");

//create review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  asyncWrapper(reviews.createReview)
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  asyncWrapper(reviews.deleteReview)
);

module.exports = router;
