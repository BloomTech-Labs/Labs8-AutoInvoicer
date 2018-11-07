const router = require("express").Router();

// Load User model
const User = require("../../models/User");

// @route GET api/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "User Works" }));

router.post("/register", (req, res) => {
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
        .then(user => res.json(user))
        .catch(err => console.log(err));
    }
  });
});

router.put("/", (req, res) => {
  // for editing user settings
});

module.exports = router;
