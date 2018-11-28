const router = require("express").Router();

// Load Invoice model
const Invoice = require("../../models/Invoice");
const User = require("../../models/User");

//Get the list of all invoices from a user
router.get("/api/invoices", (req, res) => {
  let query = req.params || {};
  const { _raw, _json, ...userProfile } = req.user;

  const auth0_userID = req.user._json.sub.split("|")[1];
  
  User.findOne({ auth0_userID })
      .populate('invoices')
      .then(user => {
        res.status(200).send(user.invoices);
      })
      .catch(err => {
        res.status(500);
        console.log(err);
      })
});

// NOT FINISHED YET Get a specific invoice from the logged in user by its invoice ID
router.get("/api/invoices/:_id", (req, res) => {

  const invoice_number = req.params._id;
  let single_invoice;

  const { _raw, _json, ...userProfile } = req.user;
  const auth0_userID = req.user._json.sub.split("|")[1];

  User.findOne({auth0_userID})
      .populate('invoices')
      .then(user => {
        /* Check to see if the invoice is part of the user's invoice,
        personally I feel this is redundant but I included it for assurance that the
        invoice was part of the user's invoices -Kevin */
        user.invoices.forEach( invoice => {
          if(invoice._id == invoice_number)
            single_invoice = invoice._id;
        })
       
        Invoice.findOne({ _id: single_invoice})
          .then(invoice =>{
            res.status(200).send(invoice);
        })
          .catch(err =>{
            res.status(500);
            console.log(err, "User look up successful but unable to find invoice with that ID");
          })
      })
      .catch(err => {
        res.status(500);
        console.log(err, "Unable to look up user for invoice ID.");
      })
})

router.post("/api/invoices", (req, res) => {
  // for creating new invoices

  const auth0_userID = req.user._json.sub.split("|")[1];

  const newInvoice = new Invoice({
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
    total: req.body.total,
    amount_paid: req.body.amount_paid,
    notes: req.body.notes,
    terms: req.body.terms
  });

  User.findOne({auth0_userID}).then(user => {
    newInvoice.save().then(invoice => {
        user.invoices.push(invoice._id);
        user.save().then(() => {
          res.send("Success!");
        })
    }).catch(err => console.log(err))
  });
});

router.put("/:_id", (req, res) => {
  // for editing existing invoices
  let edit = req.body || {},
    options = {
      new: true
    }

    Invoice.findOneAndUpdate({_id: req.params._id}, edit, options)
    .then(item => {
      res.send(item)
    })
    .catch(err => {
      res.status(500)
      console.log(err)
    })

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
