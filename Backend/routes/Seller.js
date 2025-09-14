const express = require("express");
const router = express.Router();
const Prompt = require("../models/prompModel");

router.get("/my-uploads", async (req, res) => {
  // Check if user is logged in
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in" });
  }

  // Fetch prompts uploaded by the logged-in user
  await Prompt.find({ owner: req.user._id })
    .then((prompts) => {
      res.json({ prompts });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch your uploads" });
    });
});

module.exports = router;
