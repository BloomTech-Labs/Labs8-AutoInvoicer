const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema Invoice
const InvoiceSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  invoice_number: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  due_date: {
    type: Date,
    required: true
  },
  balance_due: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: tru
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  company_name: {
    type: String,
    required: true
  },
  item: {
    type: Text,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  amount_paid: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  notes: {
    type: Text,
    required: false
  },
  terms: {
    type: Text,
    required: false
  }
});

module.exports = User = mongoose.model("invoice", InvoiceSchema);
