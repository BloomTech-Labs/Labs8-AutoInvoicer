const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema Invoice
const InvoiceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  logo: {
    type: String,
    required: false
  },
  invoice_number: {
    type: Number,
    required: false
    // TODO - set back to true
  },
  date: {
    type: Date,
    required: false
    // TODO - set back to true
  },
  due_date: {
    type: Date,
    required: false
    // TODO - set back to true
  },
  balance_due: {
    type: Number,
    required: false
    // TODO - set back to true
  },
  address: {
    type: String,
    required: false // TODO - set back to true
  },
  zipcode: {
    type: String,
    required: false // TODO - set back to true
  },
  city: {
    type: String,
    required: false // TODO - set back to true
  },
  state: {
    type: String,
    required: false // TODO - set back to true
  },
  company_name: {
    type: String,
    required: false // TODO - set back to true
  },
  invoiceTo: {
    type: String,
    required: false
  },
  // item: {
  //   type: String,
  //   required: false // TODO - set back to true
  // },
  // quantity: {
  //   type: Number,
  //   required: false // TODO - set back to true
  // },
  // rate: {
  //   type: Number,
  //   required: false // TODO - set back to true
  // },
  lineItems: [{
    item: String,
    quantity: Number,
    rate: Number
  }],
  amount: {
    type: Number,
    required: false // TODO - set back to true
  },
  subtotal: {
    type: Number,
    required: false,
  },
  discount: {
    type: Number,
    required: false
  },
  tax: {
    type: Number,
    required: false
    // TODO - change this back to true after testing
  },
  shipping: {
    type: Number,
    required: false
  },
  total: {
    type: Number,
    required: false
  },
  amount_paid: {
    type: Number,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  terms: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model("invoice", InvoiceSchema);
