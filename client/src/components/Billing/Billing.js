import React from "react";
import { Elements, StripeProvider } from "react-stripe-elements";
import CheckoutForm from "./Stripe/CheckoutForm";
import "./Billing.css";

const Billing = () => {
    return (
      <React.Fragment>
        <StripeProvider apiKey={process.env.REACT_APP_STRIPE_KEY}>
          <div className="checkout-wrapper">
            <h2>Billing</h2>
            <Elements>
              <CheckoutForm />
            </Elements>
          </div>
        </StripeProvider>
      </React.Fragment>
    );
}

export default Billing;
