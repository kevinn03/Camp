module.exports.isLoggedIn = (req, res, nect) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};
