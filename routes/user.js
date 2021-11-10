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
  asyncWrapper(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      console.log(user);
      const newUser = await User.register(user, password);
      req.login(newUser, (err) => {
        if (err) return next(err);
      });
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
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(`${redirectUrl}`);
  }
);
//logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Logged out");
  res.redirect("/campgrounds");
});
module.exports = router;
