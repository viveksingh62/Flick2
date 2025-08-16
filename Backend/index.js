const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Prompt = require("./models/prompModel");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/Promptflicker")
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log(err);
  });

app.listen(8080, () => {
  console.log(`port is listing on 8080`);
});

//home route

app.get("/", async (req, res) => {
  const data = await Prompt.find({});
  res.json(data);
});

//show route

app.get("/prompt/:id", async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Promot not found" });
    }
    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//add route

app.post("/prompt", async (req, res) => {
  try {
    console.log("Received body:", req.body); // ✅ debug

    let { platform, description, price, images } = req.body;

    const newDat = new Prompt({ platform, description, price, images });

    let newData = await newDat.save();
    console.log("file", newData);
    res.json({ message: "Data saved successfully", user: newData });
  
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete route
app.delete("/prompt/:id", async (req, res) => {
  try {
    const deletedprompt = await Prompt.findByIdAndDelete(req.params.id);
    if (!deletedprompt)
      return res.status(404).json({ message: "Prompt not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
