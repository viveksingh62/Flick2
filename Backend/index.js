const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Prompt = require("./models/prompModel");
const cors = require("cors");

const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");
const userRouter = require("./routes/user.js");
const buyRouter = require("./routes/Buy.js");
const leaderboardRouter = require("./routes/leaderboard");
const sellerRouter = require("./routes/Seller.js");
const review = require("./models/Review.js");
const Review = require("./models/Review.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
require("dotenv").config();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true, // allow cookies
  })
);
//session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7days after the cookie will delete
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  })
);
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "You must be logged in" });
}

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demouser", async (req, res) => {
  let fakeuser = new User({
    email: "demo123@gmail.com",
    username: "viveksingh",
  });

  let newUser = await User.register(fakeuser, "helloworld");
  console.log(newUser);
});
app.use("/", userRouter);
app.use("/", buyRouter);
app.use("/leaderboard", leaderboardRouter);
app.use("/", sellerRouter);
// app.get("/test",(req,res)=>{

//   req.session.name="vivek"
//   console.log(req.session)
//     res.send("test succesfull")
// })

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
  const data = await Prompt.find({}).populate("owner");
  res.json(data);
});
//filter
// Get prompts by category
app.get("/categories/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const prompts = await Prompt.find({ platform: category });
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search route
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]);
    }

    const results = await Prompt.find({
      $text: { $search: query },
    }).populate("owner");

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//show route
app.get("/prompt/:id", async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate("owner");

    if (!prompt) {
      return res.status(404).json({ message: "Promot not found" });
    }

    res.json(prompt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//add route
app.post("/prompt", isLoggedIn, async (req, res) => {
  try {
    // console.log("Received body:", req.body); // ✅ debug

    let { platform, description, price, images } = req.body;
    const newDat = new Prompt({
      platform,
      description,
      price,
      images,
      owner: req.user._id,
    });

    let newData = await newDat.save();

    console.log("file", newData);
    res.json({ message: "Data saved successfully", user: newData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete route
app.delete("/prompt/:id", isLoggedIn, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "you must be logged in" });
    }
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    if (!prompt.owner.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this prompt" });
    }
    await Review.deleteMany({ _id: { $in: prompt.review } });
    await prompt.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//reviews

app.post("/prompt/:id/review", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "you must logged in to add reviews" });
    }

    const prompt = await Prompt.findById(req.params.id).populate("owner");
    const { comment, rating } = req.body;
    const newReview = new Review({ comment, rating, author: req.user._id });

    await newReview.save();
     await newReview.populate("author", "username");
    prompt.review.push(newReview);
    await prompt.save();
    res.json({ message: "Review added successfully", review: newReview });
    console.log("new review saved");
  } catch (err) {}
});
app.get("/prompt/:id/reviews", async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate({ path: "review", populate: { path: "author" } });

    res.json(prompt.review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete review 

app.delete("/prompt/:promptId/review/:reviewId", async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "You must be logged in to delete reviews" });
    }

    const { promptId, reviewId } = req.params;

    // Find the review
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if user is the author
    if (!review.author.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this review" });
    }

    // Delete the review from Review collection
    await Review.findByIdAndDelete(reviewId);

    // Remove review reference from the prompt
    await Prompt.findByIdAndUpdate(promptId, { $pull: { review: reviewId } });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
