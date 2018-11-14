import React, { Component } from "react";
import "./Landing.css";
import { Link } from 'react-router-dom';

export default class LandingPage extends Component {
  state = {};

  render() {
    return (
      <div className="landing-page-container">
        <div className="login-bar-container">
          <a href={process.env.REACT_APP_LOGIN}>Sign In</a>
          <a href={process.env.REACT_APP_LOGIN}>Sign Up</a>
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
