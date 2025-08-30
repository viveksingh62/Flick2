const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
router.get("/signup", (req, res) => {
  res.send("signup form");
});



router.post("/signup", async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ username, email });
    let user = await User.register(newUser, password); // register user

    // automatically log in
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        success: true,
        message: "Signup and login successful",
        user: { id: user._id, username: user.username, email: user.email },
      });
    });
  } catch (err) {
    next(err);
  }
});


router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // authentication failed
      return res
        .status(401)
        .json({
          success: false,
          message: info?.message || "Invalid username or password",
        });
    }

    // log in the user
    req.logIn(user, (err) => {
      if (err) return next(err);

      return res.json({
        success: true,
        message: "Login successful",
        user: { id: user._id, username: user.username },
      });
    });
  })(req, res, next);
});

router.get("/check-auth", (req, res) => {
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

router.post("/logout", (req, res,next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Logout successfully" });
  });
});

module.exports = router;
