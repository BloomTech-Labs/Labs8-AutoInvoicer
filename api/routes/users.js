const router = require("express").Router();
const User = require("../../models/User");

//Get List of ALL user info
router.get("/", (req, res) => {
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
router.get("/:_id", (req, res) => {
  User.findOne({_id: req.params._id})
      .then(user => {
        res.status(200).send(user);
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      })
})

router.put("/:_id", (req, res) => {
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

router.delete("/:_id", (req, res) => {
  User.findOneAndRemove({ _id: req.params._id})
      .then(item => {
        res.send(item)
      })
      .catch(err => {
        res.status(500)
        console.log(err)
      })
})

module.exports = router;
