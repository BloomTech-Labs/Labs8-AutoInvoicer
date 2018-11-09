const router = require("express").Router();

// Load Billing model
const Billing = require("../../models/Billing");

router.get("/", (req, res) => {
  // possibly may need to be a post
  res.send("Billing");
});

router.post("/", (req, res) => {
  // for creating new billing
  const newBilling = new Billing({
    // user: req.user.id,
    credit_card_number: req.body.credit_card_number,
    expiration_date: req.body.expiration_date,
    cv2: req.body.cv2
  });

  newBilling
    .save()
    .then(post => res.json(post))
    .catch(err => console.log(err));
});

router.put("/", (req, res) => {
  // for editing existing invoices
});

router.delete("/:_id", (req, res) => {
  Billing.findOneAndRemove({ _id: req.params._id})
      .then(item => {
        res.send(item)
      })
      .catch(err => {
        res.status(500)
        console.log(err)
      })
})

module.exports = router;
