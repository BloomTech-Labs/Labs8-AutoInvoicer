import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

import "./CheckoutForm.css";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseOption: ""
    };
    this.submit = this.submit.bind(this);
  }

  optionHandler = event => {
    this.setState({ purchaseOption: event.target.value });
  };

  async submit(ev) {
    let purchase = {
      user: this.props.user._id,
      option: this.state.purchaseOption,
      token: await this.props.stripe.createToken({ name: "Name" })
    };
    axios
      .post(process.env.REACT_APP_STRIPE_CHARGE, purchase)
      .then(res => {
        if (purchase.option === "subscription") {
          console.log("user: " + purchase.user);
          axios
            .put(`/api/users/${purchase.user}`, {
              subscribed_member: true
            })
            .then(res => this.props.fetchUser())
            .catch(err => console.log(err));
        } else {
          let credits = this.props.user.credits;
          axios
            .put(`/api/users/${purchase.user}`, {
              credits: (credits += 1)
            })
            .then(res => this.props.fetchUser())
            .catch(err => console.log(err));
          console.log("one credit");
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="checkout">
        <div className="card-wrapper">
          <CardElement className="card-element-class" />
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
