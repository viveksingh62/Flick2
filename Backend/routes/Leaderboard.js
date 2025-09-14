const User = require("../models/User.js");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const topUsers = await User.find({})
      .sort({ score: -1 })
      .limit(3)
      .select("username score");

    res.json(topUsers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "something went wrong" });
  }
});
module.exports = router;
