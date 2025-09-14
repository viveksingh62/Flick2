const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase.js");
const Prompt = require("../models/prompModel.js");
const nodemailer = require("nodemailer");
const User = require("../models/User.js");

router.post("/buy/:id", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Please log in to buy prompts." });
    }
    const buyer = req.user;

    const { id } = req.params;
    const prompt = await Prompt.findById(id).populate("owner");
    if (!prompt) return res.status(404).json({ message: "Prompt not found" });

    const email = req.user.email;
    console.log(email);
    const alreadyBought = await Purchase.findOne({
      email: email,
      promptId: prompt._id,
    });
    if (alreadyBought) {
      return res
        .status(400)
        .json({ message: "You already bought this prompt" });
    }
    //storing purchase
    const data = new Purchase({
      email: email,
      promptId: prompt._id,
    });
    await data.save();
    console.log(prompt.owner);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `Your Prompt: ${prompt.platform}`,
      text: prompt.description,
    });
    res.status(200).json({ message: "Prompt sent to your email!" });
    let rank = await User.findByIdAndUpdate(
      prompt.owner,
      { $inc: { score: 10 } },
      { new: true },
    );

    //income
    if (buyer.money < prompt.price) {
      return res.status(400).json({ message: "Not enough balance" });
    }
    //total money
    await User.findByIdAndUpdate(prompt.owner, {
      $inc: { money: prompt.price },
    });
    //earned money
    await User.findByIdAndUpdate(prompt.owner, {
      $inc: { earned: prompt.price },
    });

    await User.findByIdAndUpdate(
      buyer._id,
      { $inc: { money: -prompt.price } },
      { new: true },
    );
    await User.findByIdAndUpdate(
      buyer._id,
      { $inc: { spent: prompt.price } },
      { new: true },
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/my-purchases", async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "You must logged in" });
    }

    const user = await User.findById(req.user._id).select(
      "username email score spent earned money",
    );
    const purchases = await Purchase.find({ email: req.user.email }).populate(
      "promptId",
    );
    res.json({
      user,
      purchases,
    });
  } catch (err) {
    console.error(err);
    res.status(500).message({ message: "Something went wrong" });
  }
});
module.exports = router;
