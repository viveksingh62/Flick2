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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1); // trust first proxy

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

//show route
app.get("/prompt/:id", async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id).populate("owner");
    console.log(prompt);
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
app.delete("/prompt/:id",isLoggedIn, async (req, res) => {
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
    await prompt.deleteOne();
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
