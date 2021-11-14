const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utility/asyncWrapper");

const Campground = require("../model/campground");

const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

//index
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

//serve create form
router.get("/new", isLoggedIn, async (req, res) => {
  res.render("campgrounds/newForm");
});

//create
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  asyncWrapper(async (req, res, next) => {
    req.body.campground.location = `${req.body.campground.locationC}, ${req.body.campground.locationP}`;

    const campgrounds = new Campground(req.body.campground);
    campgrounds.author = req.user._id;
    await campgrounds.save();
    req.flash("success", "Successfully made a new campground");
    res.redirect("/campgrounds");
  })
);

//show
router.get(
  "/:id",

  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
      .populate("reviews")
      .populate("author");

    if (!campgrounds) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs", { campgrounds });
  })
);

// serve edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    if (!campgrounds) {
      req.flash("error", "Cannot find that Campground");
      return res.redirect("/campgrounds");
    }

    const locArr = campgrounds.location.split(",");
    locArr[0] = locArr[0].trim();
    locArr[1] = locArr[1].trim();
    res.render("campgrounds/edit.ejs", { campgrounds, locArr });
  })
);

//update
router.patch(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  asyncWrapper(async (req, res) => {
    req.body.campground.location = `${req.body.campground.locationC}, ${req.body.campground.locationP}`;

    const campground = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      {
        runValidators: true,
      }
    );
    req.flash("success", "Successfully updated");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//delete
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  asyncWrapper(async (req, res) => {
    const { id: sid } = req.params;

    const campground = await Campground.findById(id);

    if (!campground.author.equals(req.user._id)) {
      req.flash("error", "No permission!");
      return res.redirect(`/campgrounds/${id}`);
    }

    await Campground.findByIdAndDelete(sid);
    req.flash("success", "Deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
