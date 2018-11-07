const router = require("express").Router();

// Load User model
const User = require("../../models/User");

// router.options('/', function (req, res) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Methods', '*');
//   res.setHeader("Access-Control-Allow-Headers", "*");
//   res.end();
// });

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.post("/", (req, res) => {
  console.log("hit endpoint")
  console.log(req.body)
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      })
        .save()
        .then(user => {
          console.log(user)
          res.json(user)
        })
        .catch(err => console.log(err));
    }
  })
  .catch(err => console.log(err));
});

module.exports = router;
