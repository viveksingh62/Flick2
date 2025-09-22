const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Prompt = require("./models/prompModel");
const cors = require("cors");
const multer = require("multer");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");
const userRouter = require("./routes/user.js");
const buyRouter = require("./routes/Buy.js");
const leaderboardRouter = require("./routes/Leaderboard.js");
const sellerRouter = require("./routes/Seller.js");
const review = require("./models/Review.js");
const Review = require("./models/Review.js");
const cloudinary = require("./cloudinary.js");

// const uploadRoutes = require("./routes/upload");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy
require("dotenv").config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://promptflick.vercel.app"  ,
  
];

// Update your CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // allow cookies to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);


const dburl = process.env.ATLASDB_URL;
const port = process.env.PORT || 8080;
mongoose
  .connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

//session
const store = MongoStore.create({ mongoUrl: dburl,
  crypto:{
    secret:"keyboardcat"
  },
  touchAfter:24*3600
 });
 store.on("error",(err)=>{
  console.log("Error in Mongo SESSION STORE",err)
 })
app.use(
  session({
    store,
      
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
     name: 'sessionId',
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //7days after the cookie will delete
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
    },
  })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "You must be logged in" });
}

// app.get("/demouser", async (req, res) => {
//   let fakeuser = new User({
//     email: "demo123@gmail.com",
//     username: "viveksingh",
//   });

//   let newUser = await User.register(fakeuser, "helloworld");
//   console.log(newUser);
// });
app.listen(port, () => {
  console.log(`port is listing on 8080`);
});
app.use("/", userRouter);
app.use("/", buyRouter);
app.use("/", leaderboardRouter);
app.use("/", sellerRouter);

app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
      },
    });
  } else {
    return res.json({ authenticated: false });
  }
});


//home route
app.get("/", async (req, res) => {
  const data = await Prompt.find({}).populate("owner").sort({ createdAt: -1 }); ;
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
const upload = multer({ dest: "uploads/" });
app.post("/prompt", isLoggedIn, upload.single("images"), async (req, res) => {
  try {
    const { platform, description, price, secret } = req.body;
    let imageUrl = "";

    //  If file exists, upload to Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "prompts", // optional Cloudinary folder
      });
      imageUrl = result.secure_url; // Cloudinary hosted URL
    }

    const newDat = new Prompt({
      platform,
      description,
      price,
      secret,
      images: imageUrl, // store Cloudinary URL
      owner: req.user._id,
    });

    const newData = await newDat.save();

    res.json({
      success: true,
      message: "Data saved successfully",
      prompt: newData,
    });
  } catch (err) {
    console.error("Error saving prompt:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//delete route
app.delete("/prompt/:id", isLoggedIn, async (req, res) => {
  try {
   
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
    const prompt = await Prompt.findById(req.params.id).populate({
      path: "review",
      populate: { path: "author" },
    });

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
//list card below reviews
// Get all prompts by platform
app.get("/prompts/:platform", async (req, res) => {
  try {
    const { platform } = req.params;
    const prompts = await Prompt.find({ platform }).populate(
      "owner",
      "username"
    );
    res.json({ success: true, prompts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// for health 
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});
