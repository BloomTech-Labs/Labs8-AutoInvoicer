import React, { Component } from "react";
import "./Landing.css";

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
          <button className="buy-button">BUY NOW</button>
        </div>
      </div>
    );
  }
}
