import React, { Component } from "react";
import "./Landing.css";

// Import Stripe Checkout
import Checkout from "../Stripe/Checkout";

export default class LandingPage extends Component {
  state = {};

  render() {
    return (
      <div className="landing-page-container">
        <div className="login-bar-container">
          <a>Sign Up</a>
          <a>Sign In</a>
        </div>
        <div className="centerpiece-container">
          <h3>
            Auto-invoicer helps small businesses generate high-quality PDF
            invoices and track them.
          </h3>
          <Checkout
            name={"Auto Invoicer"}
            description={"#1 Invoicing App"}
            amount={1}
          />
          <button className="buy-button">BUY NOW</button>
        </div>
      </div>
    );
  }
}
