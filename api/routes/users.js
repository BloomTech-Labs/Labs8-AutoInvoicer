var express = require("express");
var secured = require("../../lib/middleware/secured");
const router = require("express").Router();
const User = require("../../models/User");

// DB

//Get List of ALL user info
router.get("/users", (req, res) => {
  let query = req.params || {};

  User.find(query)
      .then(user => {
        res.status(200).send(user);
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      })
});

//Get info one user using _id
router.get("/users/:_id", (req, res) => {
  User.findOne({_id: req.params._id})
      .then(user => {
        res.status(200).send(user);
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      })
})

router.put("/users/:_id", (req, res) => {
  // for editing user settings
  let edit = req.body || {},
    options = {
      new: true
    }

    User.findOneAndUpdate({_id: req.params._id}, edit, options)
    .then(item => {
      res.send(item)
    })
    .catch(err => {
      res.status(500)
      console.log(err)
    })

});

router.delete("/users/:_id", (req, res) => {
  User.findOneAndRemove({ _id: req.params._id})
      .then(item => {
        res.send(item)
      })
      .catch(err => {
        res.status(500)
        console.log(err)
      })
})

// AUTH

/* GET user profile . */
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
          res.redirect("/")
        })
        .catch(err => console.log(err));
    } else {
      res.redirect("/");
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

/* GET user profile. */
router.get("/react_user_info", function(req, res, next) {
  if(!req.user) {return res.json({error: "No user."})}
  else {
    const { _raw, _json, ...userProfile } = req.user;
    const auth0_user = req.user._json;
    const auth0_userID = req.user._json.sub.split("|")[1];
    
    User.findOne({ auth0_userID })
    .then(mongo_user => {
      if (auth0_user == null) {
        res.redirect("/");
      } else {
        res.json(mongo_user);
      }
    })
    .catch(err => {
      console.log(err);
    });
  }
});

module.exports = router;
