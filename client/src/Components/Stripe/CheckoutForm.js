import React, { Component } from "react";
import { CardElement, injectStripe } from "react-stripe-elements";
import axios from "axios";

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: false
    };
    this.submit = this.submit.bind(this);
  }

  async submit(ev) {
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    console.log(`TOKEN: ${token}`);
    console.log(`TOKEN.ID: ${token.id}`);
    axios
      .post("/api/charge", token)
      .then(res => {
        console.log("Purchase Complete!");
        this.this.setState({ complete: true });
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.complete) {
      return <h1>Purchase Complete</h1>;
    }
    return (
      <div className="checkout">
        <p>Would you like to complete the purchase?</p>
        <CardElement />
        <button onClick={this.submit}>Send</button>
      </div>
    );
  }
}

export default injectStripe(CheckoutForm);
