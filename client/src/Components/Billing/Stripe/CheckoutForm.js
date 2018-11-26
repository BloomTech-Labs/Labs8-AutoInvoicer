import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

import "./CheckoutForm.css";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false,
      purchaseOption: ""
    };
    this.submit = this.submit.bind(this);
  }

  optionHandler = event => {
    this.setState({ purchaseOption: event.target.value });
  };

  async submit(ev) {
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    axios
      .post(process.env.REACT_APP_STRIPE_CHARGE, token)
      .then(res => {
        console.log("Purchase Complete!");
        this.setState({ complete: true });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.complete) {
      return <h1>Purchase Complete</h1>;
    }
    return (
      <div className="checkout">
        <div className="card-wrapper">
          <CardElement />
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
        <button onClick={this.submit}>Buy Now</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
