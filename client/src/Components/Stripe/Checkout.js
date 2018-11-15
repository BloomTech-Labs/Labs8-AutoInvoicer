import React from "react";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";

// import STRIPE_PUBLISHABLE from .env
// import PAYMENT_SERVER_URL from .env
const STRIPE_PUBLISHABLE = process.env.REACT_APP_STRIPE_PUBLISHABLE;
const PAYMENT_SERVER_URL = process.env.REACT_APP_PAYMENT_SERVER_URL;

const CURRENCY = "USD";

const successPayment = data => {
  alert("Payment Successful");
};

const errorPayment = data => {
  alert("Payment Error");
};

const onToken = (amount, description) => token =>
  axios
    .post(PAYMENT_SERVER_URL, {
      description,
      source: token.id,
      currency: CURRENCY,
      amount: amount
    })
    .then(successPayment)
    .catch(errorPayment);

const Checkout = ({ name, description, amount }) => (
  <StripeCheckout
    name={name}
    description={description}
    amount={amount}
    token={onToken(amount, description)}
    currency={CURRENCY}
    stripeKey={STRIPE_PUBLISHABLE}
  />
);

export default Checkout;
