var express = require("express");
var router = express.Router();
var secured = require("../../lib/middleware/secured");
var passport = require("passport");
const User = require("../../models/User");

// Perform the login, after login Auth0 will redirect to callback
router.get("/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

// router.get("/register", passport.authenticate("auth0", {}));
// Perform the final stage of authentication and redirect to previously requested URL or '/user'
router.get("/callback", function(req, res, next) {
  passport.authenticate("auth0", function(err, user, info) {
    if (err) {
      next(err);
      return res.redirect("/");
    }
    if (!user) {
      return res.redirect("/");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(`/user`);
    });
  })(req, res, next);
});

// Perform session logout and redirect to homepage
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.LOGOUT_REDIRECT);
});

module.exports = router;
