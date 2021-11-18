const Campground = require("../model/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");
// index
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index.ejs", { campgrounds });
};

// serve new form
module.exports.newCampgroundForm = async (req, res) => {
  res.render("campgrounds/newForm");
};

// create

module.exports.createCampground = async (req, res, next) => {
  req.body.campground.location = `${req.body.campground.locationC}, ${req.body.campground.locationP}`;
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "Successfully made a new campground");
  res.redirect("/campgrounds");
};

// create

// show
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show.ejs", { campground });
};

//serve edit form
module.exports.editCampgroundForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "Cannot find that Campground");
    return res.redirect("/campgrounds");
  }

  const locArr = campground.location.split(",");
  locArr[0] = locArr[0].trim();
  locArr[1] = locArr[1].trim();
  res.render("campgrounds/edit.ejs", { campground, locArr });
};

//update
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  req.body.campground.location = `${req.body.campground.locationC}, ${req.body.campground.locationP}`;

  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    {
      runValidators: true,
    }
  );
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    const trimmedImages = req.body.deleteImages.map((ele) => ele.trim());
    for (let filename of trimmedImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne(
      {
        $pull: { images: { filename: { $in: trimmedImages } } },
      },
      { new: true }
    );
    console.log(campground);
  }
  req.flash("success", "Successfully updated");
  res.redirect(`/campgrounds/${campground._id}`);
};

//delete
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "No permission!");
    return res.redirect(`/campgrounds/${id}`);
  }

  await Campground.findByIdAndDelete(id);
  req.flash("success", "Deleted campground");
  res.redirect("/campgrounds");
};
