const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const BillingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  credit_card_number: {
    type: String,
    required: true,
    max: 16
  },
  expiration_date: {
    type: String,
    required: true
  },
  cv2: {
    type: String,
    required: true
  }
});

module.exports = Billing = mongoose.model("billing", BillingSchema);
