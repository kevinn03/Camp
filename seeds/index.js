const mongoose = require("mongoose");
const Campground = require("../model/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seed");
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://localhost:27017/camp");
  console.log("Mongo connection open");
}
const cityList = cities.csvHandler();
const titleSample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1738 = Math.floor(Math.random() * 1738);
    const camp = await new Campground({
      location: `${cityList[random1738].city}, ${cityList[random1738].province_name}`,
      title: `${titleSample(descriptors)} ${titleSample(places)}`,
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
