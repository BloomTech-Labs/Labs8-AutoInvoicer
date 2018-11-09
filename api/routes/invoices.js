const router = require("express").Router();

// Load Invoice model
const Invoice = require("../../models/Invoice");

router.get("/", (req, res) => {
  // possibly may need to be a post
  res.send("Invoices");
});

router.post("/", (req, res) => {
  // for creating new invoices
  const newInvoice = new Invoice({
    // user: req.user.id,
    invoice_number: req.body.invoice_number,
    date: req.body.date,
    due_date: req.body.due_date,
    balance_due: req.body.balance_due,
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    state: req.body.state,
    company_name: req.body.company_name,
    item: req.body.item,
    quantity: req.body.quantity,
    rate: req.body.rate,
    amount: req.body.amount,
    subtotal: req.body.subtotal,
    discount: req.body.discount,
    tax: req.body.tax,
    shipping: req.body.shipping,
    amount_paid: req.body.amount_paid,
    notes: req.body.notes,
    terms: req.body.terms
  });

  newInvoice
    .save()
    .then(post => res.json(post))
    .catch(err => console.log(err));
});

router.put("/", (req, res) => {
  // for editing existing invoices
});

router.delete("/:_id", (req, res) => {
  Invoice.findOneAndRemove({ _id: req.params._id})
      .then(item => {
        res.send(item)
      })
      .catch(err=>{
        res.status(500)
        console.log(err)
      })
})


module.exports = router;
