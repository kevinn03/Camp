const express = require("express");
const methodOverride = require("method-override");

const path = require("path");
const ejsMate = require("ejs-mate");
const app = express();
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));

//parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const asyncWrapper = require("./utility/asyncWrapper");
const ExpressError = require("./utility/ExpressError");
const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/camp");
  console.log("Mongo connection open");
}
const Campground = require("./model/campground");

//index
app.get(
  "/campgrounds",
  asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index.ejs", { campgrounds });
  })
);

//serve create form
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/newForm");
});

//create
app.post(
  "/campgrounds",
  asyncWrapper(async (req, res, next) => {
    if (!req.body.title) throw new ExpressError("Invalid Campground Data", 400);
    const obj = {
      ...req.body,
      location: `${req.body.locationC}, ${req.body.locationP}`,
    };

    const campgrounds = new Campground(obj);
    await campgrounds.save();
    res.redirect("/campgrounds");
  })
);

//show
app.get(
  "/campgrounds/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    res.render("campgrounds/show.ejs", { campgrounds });
  })
);

// serve edit form
app.get(
  "/campgrounds/:id/edit",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id);
    const locArr = campgrounds.location.split(",");
    locArr[0] = locArr[0].trim();
    locArr[1] = locArr[1].trim();
    res.render("campgrounds/edit.ejs", { campgrounds, locArr });
  })
);

//update
app.patch(
  "/campgrounds/:id",
  asyncWrapper(async (req, res) => {
    const { id: sid } = req.params;

    const campgrounds = await Campground.findOneAndUpdate(
      { id: sid },
      {
        ...req.body,
        location: `${req.body.locationC}, ${req.body.locationP}`,
      },

      {
        runValidators: true,
      }
    );
    console.log(campgrounds);
    res.redirect(`/campgrounds/${campgrounds._id}`);
  })
);

//delete
app.delete(
  "/campgrounds/:id",
  asyncWrapper(async (req, res) => {
    const { id: sid } = req.params;

    await Campground.findByIdAndDelete(sid);
    console.log("Deleted!");

    res.redirect("/campgrounds");
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
