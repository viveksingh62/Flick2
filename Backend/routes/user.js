const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const user = await User.register(newUser, password);

    // Auto-login after signup
    req.logIn(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }
      return res.json({
        success: true,
        message: "Signup and login successful",
        user: { id: user._id, username: user.username, email: user.email },
      });
    });
  } catch (err) {
    // Handle duplicate email or validation errors
    if (err.name === "UserExistsError") {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
});

// Login route
router.post("/login", (req, res, next) => {
  console.log("Login attempt for:", req.body.username);
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Auth error:", err);
      return res.status(500).json({ success: false, message: "Auth error" });
    }

    if (!user) {
      console.log("Login failed:", info?.message);
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid username or password",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Login failed" });
      }

      console.log("Login successful for:", user.username);
      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          score: user.score,
          money: user.money,
          earned: user.earned,
          spent: user.spent,
        },
      });
    });
  })(req, res, next);
});

// Check authentication
router.get("/check-auth", (req, res) => {
    console.log("Session exists:", !!req.session);
  console.log("User authenticated:", req.isAuthenticated());
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

// Logout
router.post("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie('sessionId', {
        path: '/',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
      });
    return res.json({ success: true, message: "Logout successfully" });
  });
}); 

module.exports = router;
