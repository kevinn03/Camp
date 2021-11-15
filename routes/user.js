const express = require("express");
const router = express.Router();

const asyncWrapper = require("../utility/asyncWrapper");
const passport = require("passport");
const users = require("../controllers/users");

// get registration form
router.get("/register", users.renderRegister);

//register user
router.post("/register", asyncWrapper(users.register));

// login form
router.get("/login", users.renderLogin);
//login user
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);
//logout
router.get("/logout", users.logout);
module.exports = router;
