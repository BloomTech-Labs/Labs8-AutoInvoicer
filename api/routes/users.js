const router = require("express").Router();

router.get("/", (req, res) => {
  // possibly may need to be a post
});

router.put("/", (req, res) => {
  // for editing user settings
});

router.delete("/:_id", (req, res) => {
  user.findOneAndRemove({ _id: req.params._id})
      .then(item => {
        res.send(item)
      })
      .catch(err => {
        res.status(500)
        console.log(err)
      })
})

module.exports = router;
