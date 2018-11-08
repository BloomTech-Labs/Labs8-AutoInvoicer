const router = require("express").Router();
const user = require("../../models/User");

//Get List of ALL user info
router.get("/", (req, res) => {
  let query = req.params || {};

  user.find(query)
      .then(user => {
        res.status(200).send(user);
        next();
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      })
});

//Get info one user using _id
router.get("/:_id", (req, res) => {
  user.findOne({_id: req.params._id})
      .then(user => {
        res.status(200).send(user);
        next()
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      })
})

router.put("/", (req, res) => {
  // for editing user settings
});

module.exports = router;
