const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("cloudinary");
const os = require("os");

// Load Invoice model
const Invoice = require("../../models/Invoice");
const User = require("../../models/User");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Get the list of all invoices from a user
router.get("/api/invoices", (req, res) => {
  let query = req.params || {};
  const { _raw, _json, ...userProfile } = req.user;

  const auth0_userID = req.user._json.sub.split("|")[1];

  User.findOne({ auth0_userID })
    .populate("invoices")
    .then(user => {
      res.status(200).send(user.invoices);
    })
    .catch(err => {
      res.status(500);
      console.log(err);
    });
});

// NOT FINISHED YET Get a specific invoice from the logged in user by its invoice ID
router.get("/api/invoices/:_id", (req, res) => {
  const invoice_number = req.params._id;
  let single_invoice;

  const { _raw, _json, ...userProfile } = req.user;
  const auth0_userID = req.user._json.sub.split("|")[1];

  User.findOne({ auth0_userID })
    .populate("invoices")
    .then(user => {
      /* Check to see if the invoice is part of the user's invoice,
        personally I feel this is redundant but I included it for assurance that the
        invoice was part of the user's invoices -Kevin */
      user.invoices.forEach(invoice => {
        if (invoice._id == invoice_number) single_invoice = invoice._id;
      });

      Invoice.findOne({ _id: single_invoice })
        .then(invoice => {
          res.status(200).send(invoice);
        })
        .catch(err => {
          res.status(500);
          console.log(
            err,
            "User look up successful but unable to find invoice with that ID"
          );
        });
    })
    .catch(err => {
      res.status(500);
      console.log(err, "Unable to look up user for invoice ID.");
    });
});

router.post("/", upload.single("logo"), (req, res) => {
  // for creating new invoices
  console.log("File: ", req.file);
  console.log(req.body);
  const auth0_userID = req.body.auth0_userID;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
  });

  const lineItems = JSON.parse(req.body.lineItems);

  lineItems.forEach(row => {
    row.quantity = Number(row.quantity);
    row.rate = Number(row.rate);
  });

  let logo = null;

  if (req.file) {
    const ext = req.file.originalname.split(".")[1];
    const tmp = os.tmpdir() + "/deleteme." + ext;
    fs.writeFileSync(tmp, req.file.buffer);
    cloudinary.v2.uploader.upload(
    tmp,
      { public_id: `auto-invoicer/${Date.now()}` },
      (error, result) => {
        console.log(error);
        logo = result.secure_url;
      }
    );
  }


  const newInvoice = new Invoice({
    logo,
    invoice_number: Number(req.body.invoice_number),
    date: req.body.date,
    due_date: req.body.due_date,
    balance_due: Number(req.body.balance_due),
    address: req.body.address,
    zipcode: req.body.zipcode,
    city: req.body.city,
    state: req.body.state,
    company_name: req.body.company_name,
    // item: req.body.item,
    // quantity: Number(req.body.quantity),
    // rate: Number(req.body.rate),
    invoiceTo: req.body.invoiceTo,
    line_items: lineItems,
    amount: Number(req.body.amount),
    subtotal: Number(req.body.subtotal),
    discount: Number(req.body.discount),
    tax: Number(req.body.tax),
    shipping: Number(req.body.shipping),
    total: Number(req.body.total),
    amount_paid: Number(req.body.amount_paid),
    notes: req.body.notes,
    terms: req.body.terms
  });

  User.findOne({ auth0_userID }).then(user => {
    newInvoice
      .save()
      .then(invoice => {
        user.invoices.push(invoice._id);
        user.save().then(() => {
          res.send("Success!");
        });
      })
      .catch(err => console.log(err));
  });
});

router.put("/api/invoices/:_id", upload.single("logo"), (req, res) => {
  // for editing existing invoices
  let options = {
    new: true
  };

  const invoice_number = req.params._id;
  let single_invoice;
  const { _json, ...userProfile } = req.user;
  const auth0_userID = req.user._json.sub.split("|")[1];

  const lineItems = JSON.parse(req.body.lineItems);

  lineItems.forEach(row => {
    row.quantity = Number(row.quantity);
    row.rate = Number(row.rate);
  });

  if (req.file) {
    const ext = req.file.originalname.split(".")[1];
    const tmp = os.tmpdir() + "/deleteme." + ext;
    fs.writeFileSync(tmp, req.file.buffer);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_KEY,
      api_secret: process.env.CLOUDINARY_SECRET
    });

    cloudinary.v2.uploader.upload(
      tmp,
      { public_id: `auto-invoicer/${Date.now()}` },
      (error, result) => {
        const edit = {
          logo: result.secure_url,
          invoice_number: Number(req.body.invoice_number),
          date: req.body.date,
          due_date: req.body.due_date,
          balance_due: Number(req.body.balance_due),
          address: req.body.address,
          zipcode: req.body.zipcode,
          city: req.body.city,
          state: req.body.state,
          company_name: req.body.company_name,
          invoiceTo: req.body.invoiceTo,
          line_items: lineItems,
          // item: req.body.item,
          // quantity: Number(req.body.quantity),
          // rate: Number(req.body.rate),
          amount: Number(req.body.amount),
          subtotal: Number(req.body.subtotal),
          discount: Number(req.body.discount),
          tax: Number(req.body.tax),
          shipping: Number(req.body.shipping),
          total: Number(req.body.total),
          amount_paid: Number(req.body.amount_paid),
          notes: req.body.notes,
          terms: req.body.terms
        };

        User.findOne({ auth0_userID })
          .populate("invoices")
          .then(user => {
            user.invoices.forEach(invoice => {
              if (invoice._id == invoice_number) single_invoice = invoice._id;
            });

            Invoice.updateOne({ _id: single_invoice }, edit)
              .then(invoice => {
                res.status(200).send(invoice);
              })
              .catch(err => {
                res.status(500);
                console.log(
                  err,
                  "User look up successful but unable to find invoice with that ID"
                );
              });
          })
          .catch(err => {
            res.status(500);
            console.log(err, "Unable to look up user for invoice ID.");
          });
      }
    );
  } else {
    const edit = {
      invoice_number: Number(req.body.invoice_number),
      date: req.body.date,
      due_date: req.body.due_date,
      balance_due: Number(req.body.balance_due),
      address: req.body.address,
      zipcode: req.body.zipcode,
      city: req.body.city,
      state: req.body.state,
      company_name: req.body.company_name,
      invoiceTo: req.body.invoiceTo,
      line_items: lineItems,
      // item: req.body.item,
      // quantity: Number(req.body.quantity),
      // rate: Number(req.body.rate),
      amount: Number(req.body.amount),
      subtotal: Number(req.body.subtotal),
      discount: Number(req.body.discount),
      tax: Number(req.body.tax),
      shipping: Number(req.body.shipping),
      total: Number(req.body.total),
      amount_paid: Number(req.body.amount_paid),
      notes: req.body.notes,
      terms: req.body.terms
    };

    User.findOne({ auth0_userID })
      .populate("invoices")
      .then(user => {
        user.invoices.forEach(invoice => {
          if (invoice._id == invoice_number) single_invoice = invoice._id;
        });

        Invoice.updateOne({ _id: single_invoice }, edit)
          .then(invoice => {
            res.status(200).send(invoice);
          })
          .catch(err => {
            res.status(500);
            console.log(
              err,
              "User look up successful but unable to find invoice with that ID"
            );
          });
      })
      .catch(err => {
        res.status(500);
        console.log(err, "Unable to look up user for invoice ID.");
      });
  }
});

router.delete("/:_id", (req, res) => {
  Invoice.findOneAndRemove({ _id: req.params._id })
    .then(item => {
      res.send(item);
    })
    .catch(err => {
      res.status(500);
      console.log(err);
    });
});

module.exports = router;
