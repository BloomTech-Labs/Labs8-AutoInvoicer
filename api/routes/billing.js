const router = require("express").Router();

// Load Billing model
const Billing = require("../../models/Billing");

//Get List of ALL billing info
router.get("/billings", (req, res) => {
  let query = req.params || {};

  Billing.find(query)
    .then(info => {
      res.status(200).send(info);
    })
    .catch(err => {
      res.status(500);
      console.log(err);
    });
});

//Get info of single user billing info using _id
router.get("/billings/:_id", (req, res) => {

  Billing.findOne({ _id: req.params._id })
      .then(info => {
        res.status(200).send(info);
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      });
});

router.post("/billings", (req, res) => {
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

router.put("/billings/:_id", (req, res) => {
  // for editing existing invoices
  let edit = req.body || {},
    options = {
      new: true
    }

    Billing.findOneAndUpdate({_id: req.params._id}, edit, options)
    .then(item => {
      res.send(item)
    })
    .catch(err => {
      res.status(500)
      console.log(err)
    })

});

router.delete("/billings/:_id", (req, res) => {
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
