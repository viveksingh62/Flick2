const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase.js");
const Prompt = require("../models/prompModel.js");
const nodemailer = require("nodemailer");
const User = require("../models/User.js");

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "You must be logged in" });
}

router.post("/buy/:id", isLoggedIn, async (req, res) => {
  try {
    const buyer = await User.findById(req.user._id);
    const prompt = await Prompt.findById(req.params.id).populate("owner");
    if (!prompt) return res.status(404).json({ message: "Prompt not found" });

    // Check if already bought
    const alreadyBought = await Purchase.findOne({
      email: buyer.email,
      promptId: prompt._id,
    });
    if (alreadyBought) {
      return res.status(200).json({
        message: "You already bought this prompt",
        alreadyBought: true,
      });
    }

    // Check buyer balance
    if (buyer.money < prompt.price)
      return res.status(400).json({ message: "Not enough balance" });

    const session = await User.startSession();
    session.startTransaction();

    let updatedBuyer;
    try {
      // Update owner
      await User.findByIdAndUpdate(
        prompt.owner._id,
        {
          $inc: { money: prompt.price, earned: prompt.price, score: 10 },
        },
        { new: true, session }
      );

      // Update buyer
      updatedBuyer = await User.findByIdAndUpdate(
        buyer._id,
        { $inc: { money: -prompt.price, spent: prompt.price } },
        { new: true, session }
      );

      // Save purchase
      await new Purchase({
        email: buyer.email,
        promptId: prompt._id,
      }).save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    // Try sending email separately
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      }
    );
      console.log(transporter)

      let send = await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: buyer.email,
         replyTo: buyer.email,
        subject: `Thanks for visiting PromptFlick: ${prompt.platform}`,
        text: prompt.secret,
      }  );
      console.log(send.response)
      return res.status(200).json({
     message: "Prompt sent to your email! You can also view it in your profile."
,
        user: updatedBuyer,
      });
    } catch (mailErr) {
      console.error("Email sending failed:", mailErr);
      return res.status(200).json({
        message: "Purchase successful, but email could not be sent. Please contact support at promptflick@gmail.com.",

        user: updatedBuyer,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/my-purchases", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "You must logged in" });
    }

    const user = await User.findById(req.user._id).select(
      "username email score spent earned money"
    );
    const purchases = await Purchase.find({ email: req.user.email }).populate(
      "promptId"
    );
    res.json({
      user,
      purchases,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;