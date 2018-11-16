import React, { Component } from "react";
import NavBar from "../Navbar/Navbar";
import "./Billing.css";
import "../Navbar/Navbar.css";

export default class Billing extends Component {
  constructor() {
    super();
    this.state = {
      credits: 3,
      creditCardNumber: 0,
      expirationMonth: 0,
      expirationYear: 0,
      cVVcode: 0,
      purchaseOption: ""
    };
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  optionHandler = event => {
    this.setState({ purchaseOption: event.target.value });
  };

  buyClickHandler() {
    //TODO: Send information collected
  }

  render() {
    return (
      <div className="billings-page-container">
        <div className="header-container">
          <div className="current-page">
            <a> Home </a> > Billing
          </div>
          <div className="account-info">
            Credits: {this.state.credits}
            <a> Sign Out </a>
          </div>
        </div>
        <div className="content-container">
          <div className="payment-container">
            <h2 className="billing-h2"> Billing </h2>
            <p>Payment Info</p>
            <div className="card-info-container">
              <input
                placeholder="Credit Card Number"
                name="creditCardNumber"
                type="email"
                onChange={this.handleChange}
              />
              <form className="expiration">
                Expiration Date:&nbsp;
                <input
                  placeholder="Month"
                  name="expirationMonth"
                  type="number"
                  min="1"
                  max="12"
                  onChange={this.handleChange}
                />
                /
                <input
                  placeholder="Year"
                  name="expirationYear"
                  type="number"
                  min="18"
                  max="99"
                  onChange={this.handleChange}
                />
              </form>
              <input
                id="CVV"
                placeholder="CVV"
                name="cVVcode"
                type="text"
                onChange={this.handleChange}
              />
            </div>
            <form className="options">
              <label>
                <input
                  type="radio"
                  name="1 Year Subscription - $9.99"
                  value="subscription"
                  checked={this.state.purchaseOption === "subscription"}
                  onChange={this.optionHandler}
                />
                1 Year Subscription - $9.99
              </label>
              <label>
                <input
                  type="radio"
                  name="1 Invoice - $0.99"
                  value="once"
                  checked={this.state.purchaseOption === "once"}
                  onChange={this.optionHandler}
                />
                1 Invoice - $0.99
              </label>
            </form>
            <button className="buy-button">BUY NOW</button>
          </div>
        </div>
      </div>
    );
  }
}
