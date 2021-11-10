const express = require("express");
const router = express.Router();
const User = require("../model/user");
const asyncWrapper = require("../utility/asyncWrapper");
const passport = require("passport");

// get registration form
router.get("/register", (req, res) => {
  res.render("users/register");
});

//register user
router.post(
  "/register",
  asyncWrapper(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      console.log(user);
      const newUser = await User.register(user, password);
      req.flash("success", "Welcome!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

// login form
router.get("/login", (req, res) => {
  res.render("users/login");
});
//login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
  }
);
module.exports = router;
