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

  console.log(Array.isArray(initData)); // should print true
  console.log(initData[0]); // should print first prompt

  const updatedinitData = initData.map((obj) => ({
    ...obj,
    owner: "68aeb35238742c89df84cbc7",
  }));
  await prompt.insertMany(updatedinitData);
  console.log("sample data addead");
};

initDB();
