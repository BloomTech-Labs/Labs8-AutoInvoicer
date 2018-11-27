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
    let purchaseOption = {
      user: this.props.user.user._id,
      option: this.state.purchaseOption,
      token: await this.props.stripe.createToken({ name: "Name" }),
    }
    // let { token } = await this.props.stripe.createToken({ name: "Name" });
    axios
      .post(process.env.REACT_APP_STRIPE_CHARGE, purchaseOption)
      .then(res => {
        console.log(res);
        console.log("Purchase Complete!");
        if (purchaseOption.option === "subscription") {
          console.log("user: " + purchaseOption.user);
          axios
            .put(`/api/users/${purchaseOption.user}`, {"subscribed_member": true})
            .then(res => console.log(res))
            .catch(err => console.log(err))
        } else {
          let credits = this.props.user.user.credits;
          axios
            .put(`/api/users/${purchaseOption.user}`, {"credits": credits += 1})
            .then(res => console.log(res))
            .catch(err => console.log(err))
          console.log("one credit");
        }
        this.setState({ complete: true });
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log(this.props)
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
