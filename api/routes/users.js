const router = require("express").Router();

router.get("/test", (req, res) => res.json({ msg: "User Works" }));

router.put("/", (req, res) => {
  // for editing user settings
});

module.exports = router;
