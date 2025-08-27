const mongoose = require("mongoose");
const initData = require("./data");
const prompt = require("../models/prompModel");

mongoose
  .connect("mongodb://127.0.0.1:27017/Promptflicker")
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await prompt.deleteMany({});
  await prompt.insertMany(initData);
  console.log("sample data added");
};

initDB();
