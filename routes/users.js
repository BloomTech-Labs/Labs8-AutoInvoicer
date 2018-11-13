var express = require("express");
var secured = require("../lib/middleware/secured");
var router = express.Router();

/* GET user profile. */
router.get("/user", secured(), function(req, res, next) {
  const { _raw, _json, ...userProfile } = req.user;
  // console.log(req.user);
  // console.log("Console log test: ", req.user.displayName, req.user.id, req.user.emails[0].value, req.user.nickname);
  // console.log("CONSOLE LOG: ", req.user.displayName, req.user.id.split[1], req.emails, req.nickname );
  res.render("user", {
    userProfile: JSON.stringify(userProfile, null, 2),
    title: "Profile page"
  });
});

module.exports = router;
