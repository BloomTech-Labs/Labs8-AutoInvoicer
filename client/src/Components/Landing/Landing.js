import React, { Component } from "react";
import "./Landing.css";
import { Link } from 'react-router-dom';

// Import Stripe Checkout
import Checkout from "../Stripe/Checkout";

export default class LandingPage extends Component {
  state = {};

  placeToken() {
    window.localStorage.setItem('token', 'token')
  }

  render() {
    return (
      <div className="landing-page-container">
        <div className="login-bar-container">
          <a href={process.env.REACT_APP_LOGIN} onClick={this.placeToken}>Sign In</a>
          <a href={process.env.REACT_APP_LOGIN} onClick={this.placeToken}>Sign Up</a>
        </div>
        <div className="centerpiece-container">
          <h3>
            Auto-invoicer helps small businesses generate high-quality PDF
            invoices and track them.
          </h3>
          <Checkout
            name={"Auto Invoicer"}
            description={"#1 Invoicing App"}
            amount={100}
          />
          <button className="buy-button">BUY NOW</button>
        </div>
      </div>
    );
  }
}
