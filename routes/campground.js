const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utility/asyncWrapper");
const campgrounds = require("../controllers/campgrounds");
const Campground = require("../model/campground");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(asyncWrapper(campgrounds.index))
  .post(
    isLoggedIn,
    validateCampground,
    asyncWrapper(campgrounds.createCampground)
  );

//serve create form
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

router
  .route("/:id")
  .get(asyncWrapper(campgrounds.showCampground))
  .patch(
    isLoggedIn,
    isAuthor,
    validateCampground,
    asyncWrapper(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, asyncWrapper(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  asyncWrapper(campgrounds.editCampgroundForm)
);

module.exports = router;
