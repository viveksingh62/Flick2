require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const cors = require("cors");
const multer = require("multer");

const User = require("./models/User.js");
const Prompt = require("./models/prompModel");
const Review = require("./models/Review.js");
const cloudinary = require("./cloudinary.js");

const userRouter = require("./routes/user.js");
const buyRouter = require("./routes/Buy.js");
const leaderboardRouter = require("./routes/Leaderboard.js");
const sellerRouter = require("./routes/Seller.js");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // required for secure cookies behind proxy

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "https://promptflick.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // for Postman or mobile
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// --- MongoDB connection ---
const dburl = process.env.ATLASDB_URL;
mongoose
  .connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Session store ---
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: { secret: process.env.SESSION_SECRET },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => console.log("MongoStore error:", err));

// --- Session middleware (BEFORE passport) ---
app.use(
  session({
    store,
    name: "sessionId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// --- Passport ---
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Middleware ---
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "You must be logged in" });
}

// --- Routers ---
app.use("/", userRouter);
app.use("/", buyRouter);
app.use("/", leaderboardRouter);
app.use("/", sellerRouter);

// --- Multer setup for uploads ---
const upload = multer({ dest: "uploads/" });

// --- Routes ---

// Check auth
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

// Home route
app.get("/", async (req, res) => {
  const data = await Prompt.find({}).populate("owner").sort({ createdAt: -1 });
  res.json(data);
});

// Add prompt
app.post("/prompt", isLoggedIn, upload.single("images"), async (req, res) => {
  try {
    const { platform, description, price, secret } = req.body;
    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "prompts",
      });
      imageUrl = result.secure_url;
    }

    const newPrompt = new Prompt({
      platform,
      description,
      price,
      secret,
      images: imageUrl,
      owner: req.user._id,
    });

    const savedPrompt = await newPrompt.save();
    res.json({ success: true, prompt: savedPrompt });
  } catch (err) {
    console.error("Error saving prompt:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete prompt
app.delete("/prompt/:id", isLoggedIn, async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) return res.status(404).json({ message: "Prompt not found" });
    if (!prompt.owner.equals(req.user._id))
      return res.status(403).json({ message: "Not authorized" });

    await Review.deleteMany({ _id: { $in: prompt.review } });
    await prompt.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

// --- Start server ---
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
