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
      author: "6191908b9eab5a1918c84174",
      location: `${cityList[random1738].city}, ${cityList[random1738].province_name}`,
      title: `${titleSample(descriptors)} ${titleSample(places)}`,

      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non, eum saepe! Hiccorporis omnis nam expedita provident consectetur labore, ipsum vel delectus impedit tempora voluptate pariatur harum in quod iure!",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png",
          filename: "YelpCamp/ahfnenvca4tha00h2ubt",
        },
        {
          url: "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png",
          filename: "YelpCamp/ruyoaxgf72nzpi4y6cdi",
        },
      ],
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
