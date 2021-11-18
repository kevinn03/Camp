const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utility/asyncWrapper");
const campgrounds = require("../controllers/campgrounds");
const Campground = require("../model/campground");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router
  .route("/")
  .get(asyncWrapper(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("campground[images]"),
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
    upload.array("campground[images]"),
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
