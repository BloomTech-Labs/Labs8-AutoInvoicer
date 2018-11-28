const router = require("express").Router();
const stripe = require("stripe")("sk_test_6zlW7juiq2ocryXPxJgxxatU");
router.use(require("body-parser").text());

router.post("/", async (req, res) => {
  if (req.body.option === "once") {
    try {
      let { status } = await stripe.charges.create({
        amount: 99,
        currency: "usd",
        description: "one credit",
        source: req.body.token.token.id
      });
      res.json({ status });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  } else {
    try {
      let { status } = await stripe.charges.create({
        amount: 999,
        currency: "usd",
        description: "unlimited",
        source: req.body.token.token.id
      });
      res.json({ status });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  }
});

module.exports = router;
