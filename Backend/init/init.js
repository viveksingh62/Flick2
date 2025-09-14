import mongoose from "mongoose"; // ✅ Correct for ES module

// const initData = require("./data"); // your array of prompt objects
// const Prompt = require("../models/prompModel");

mongoose
  .connect("mongodb://127.0.0.1:27017/Promptflicker")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log(err));

// const initDB = async () => {
//   try {
//     // Remove all existing prompts
//     await Prompt.deleteMany({});
//     console.log("Existing prompts cleared.");

//     console.log(Array.isArray(initData)); // true
//     console.log("First prompt before adding owner:", initData[0]);

//     // Map prompts to add proper ObjectId as owner
//     const updatedInitData = initData.map((obj) => ({
//       ...obj,
//       owner: new mongoose.Types.ObjectId("68b998263e6fa03d8b9960ca"), // ✅ Use your seller's ObjectId
//     }));

//     // Insert updated prompts
//     await Prompt.insertMany(updatedInitData);
//     console.log("Sample prompts added with owner!");
//   } catch (err) {
//     console.error("Error initializing DB:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// // Run the script
// initDB();
import User from "../models/User.js";

// Add 100 demo money to everyone
await User.updateMany({}, { $set: { money: 100 } });
console.log("Demo money added to all users!");
