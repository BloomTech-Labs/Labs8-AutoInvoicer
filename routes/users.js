var express = require("express");
var secured = require("../lib/middleware/secured");
var router = express.Router();
const User = require("../models/User");

/* GET user profile. */
router.get("/user", secured(), function(req, res, next) {
  console.log("hit endpoint")
  console.log("REQUEST.USER: ", req.user);
  const { _raw, _json, ...userProfile } = req.user;
  const auth0_userID = req.user._json.sub.split("|")[1];

  User.findOne({ auth0_userID })
  .then(user => {
    console.log("RETURNED FROM MONGO:", user);
    if (!user) {
      const newUser = new User({
        username: req.user.nickname,
        auth0_userID,
        email: req.user.emails[0].value
      })
        .save()
        .then(user => {
          res.redirect("/invoices")
        })
        .catch(err => console.log(err));
    } else {
      res.redirect("/invoices");
    }
  })
  .catch(err => {
    console.log(err);
  });
});

router.get("/user/:_id", (req, res) => {
  user
    .findOne({ auth0_userIDs })
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      res.status(500);
      console.log(err);
    });
});

module.exports = router;
