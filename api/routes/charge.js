const router = require("express").Router();
const stripe = require("stripe")("sk_test_6zlW7juiq2ocryXPxJgxxatU");
router.use(require("body-parser").text());

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    let { status } = await stripe.charges.create({
      amount: 2000,
      currency: "usd",
      description: "An example charge",
      source: req.body.id
    });
    console.log("stripe success");
    res.json({ status });
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

module.exports = router;
