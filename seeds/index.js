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
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = await new Campground({
      location: `${cityList[random1738].city}, ${cityList[random1738].province_name}`,
      title: `${titleSample(descriptors)} ${titleSample(places)}`,
      image: `https://source.unsplash.com/collection/483251`,
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non, eum saepe! Hiccorporis omnis nam expedita provident consectetur labore, ipsum vel delectus impedit tempora voluptate pariatur harum in quod iure!",
      price,
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
