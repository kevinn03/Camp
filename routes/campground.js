const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utility/asyncWrapper");
const campgrounds = require("../controllers/campgrounds");
const Campground = require("../model/campground");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

//index
router.get("/", asyncWrapper(campgrounds.index));

//serve create form
router.get("/new", isLoggedIn, campgrounds.newCampgroundForm);

//create
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  asyncWrapper(campgrounds.createCampground)
);

//show
router.get(
  "/:id",

  asyncWrapper(campgrounds.showCampground)
);

// serve edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  asyncWrapper(campgrounds.editCampgroundForm)
);

//update
router.patch(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  asyncWrapper(campgrounds.updateCampground)
);

//delete
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  asyncWrapper(campgrounds.deleteCampground)
);

module.exports = router;
