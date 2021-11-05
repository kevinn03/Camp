const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utility/asyncWrapper");
const ExpressError = require("../utility/ExpressError");
const Campground = require("../model/campground");
const { campgroundSchema, reviewSchema } = require("../schemas.js");

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((ele) => ele.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//index
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

//serve create form
router.get("/new", async (req, res) => {
  res.render("campgrounds/newForm");
});

//create
router.post(
  "/",
  validateCampground,
  asyncWrapper(async (req, res, next) => {
    req.body.campground.location = `${req.body.campground.locationC}, ${req.body.campground.locationP}`;

    const campgrounds = new Campground(req.body.campground);
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
    const campgrounds = await Campground.findById(id).populate("reviews");
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
  validateCampground,
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    req.body.campground.location = `${req.body.campground.locationC}, ${req.body.campground.locationP}`;

    const campgrounds = await Campground.findByIdAndUpdate(
      id,
      { ...req.body.campground },
      {
        runValidators: true,
      }
    );
    res.flash("success", "Successfully updated");
    res.redirect(`/campgrounds/${campgrounds._id}`);
  })
);

//delete
router.delete(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id: sid } = req.params;

    await Campground.findByIdAndDelete(sid);
    req.flash("success", "Deleted campground");
    res.redirect("/campgrounds");
  })
);

module.exports = router;
