import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import qs from 'qs';


import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";

import "./InvoiceForm.css";
import Navbar from "../Navbar/Navbar";
import TopNav from "../TopNav/TopNav";

class InvoiceForm extends Component {
  state = {
    invoiceNumber: "",
    date: "",
    dueDate: "",
    invoiceFrom: "",
    invoiceTo: "",
    balanceDue: 0,
    address: "",
    zip: "",
    city: "",
    cityState: "",
    item: "",
    quantity: 0,
    rate: 0,
    amount: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    amountPaid: 0,
    notes: "",
    terms: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handlesubmit = event => {
    event.preventDefault();
    const {
      invoiceNumber,
      date,
      dueDate,
      invoiceFrom,
      invoiceTo,
      balanceDue,
      address,
      zip,
      city,
      cityState,
      item,
      quantity,
      rate,
      amount,
      subtotal,
      discount,
      shipping,
      total,
      amountPaid,
      notes,
      terms
    } = {
      ...this.state
    };

    this.calculateTax();
  };

  calculateTax() {
    //Calculates the tax rate of the invoice total by using an external tax API.
    //Calculated using the address

    //Turn our data into a querystring
    const query = qs.stringify({
      line1: '3919 w. Greenleaf Ave.', //Line 1,2,3 are used for addresses. 2 and 3 are optional
      line2: '',
      line3: '',
      city: 'Chicago',//this.state.city,
      region: 'IL',//this.state.cityState,
      postalCode: '60712', //this.state.zipcode,
      country: 'US' //Only works in US for free version
    })

    axios({
      method: 'get',
      url: `https://rest.avatax.com/api/v2/taxrates/byaddress?${query}`,
      headers: {
          'Accept': "application/json",
          'Authorization': process.env.REACT_APP_TAX_AUTH
      }
    })
      .then(res => {
        this.setState({ tax: this.state.subtotal * res.data.totalRate }); //Our tax is the subtotal * tax rate returned by API
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    return (
      <div>
        {/* <TopNav /> */}
        {/* <Navbar /> */}
        <div className="form-container1">
          <form>
            {/* Add Logo */}
            <FormGroup>
              <Label for="addLogo">Add Your Logo</Label>
              <Input type="file" name="file" id="addLogo" />
              <FormText color="muted">
                Browse file to add your company logo.
              </FormText>
            </FormGroup>

            {/* Invoice Header Rigth Side */}
            <FormGroup row classname="right-indent">
              <Label for="invoiceNumber" sm={2}>
                Invoice Number
              </Label>
              <Col sm={4}>
                <Input
                  type="number"
                  name="invoiceNumber"
                  id="invoiceNumber"
                  placeholder="Invoice Number"
                />
              </Col>
              <Label for="date" sm={2}>
                Date
              </Label>
              <Col sm={4}>
                <Input type="date" name="date" id="date" placeholder="Date" />
              </Col>
              <Label for="dueDate" sm={2}>
                Due Date
              </Label>
              <Col sm={4}>
                <Input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  placeholder="Due Date"
                />
              </Col>
              <Label for="balanceDue" sm={2}>
                Balance Due
              </Label>
              <Col sm={4}>
                <Input
                  type="number"
                  name="balanceDue"
                  id="balanceDue"
                  placeholder="$ 0.00"
                />
              </Col>
            </FormGroup>

            {/* Invoice Customer Company Details */}

            <FormGroup>
              <Label for="invoiceFrom">Invoice From</Label>
              <Input
                type="text"
                name="invoiceFrom"
                id="invoiceFrom"
                placeholder="Invoice From"
              />
            </FormGroup>
            <FormGroup>
              <Label for="invoiceTo">Invoice To</Label>
              <Input
                type="text"
                name="invoiceTo"
                id="invoiceTo"
                placeholder="Invoice To"
              />
            </FormGroup>
          
            {/* Address, State, Zip */}
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
              />
            </FormGroup>
            <Row form>
              <Col md={2}>
                <FormGroup>
                  <Label for="zip">Zip</Label>
                  <Input type="text" name="zip" id="zip" placeholder="Zip" />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input type="text" name="city" id="city" placeholder="City" />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="state">State</Label>
                  <Input
                    type="text"
                    name="state"
                    id="state"
                    placeholder="State"
                  />
                </FormGroup>                
              </Col>
            </Row>

            {/* Items and Cost */}
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="item">Item</Label>
                  <Input type="text" name="item" id="item" placeholder="Add Item Here" />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="quanity">Quantity</Label>
                  <Input type="number" name="quantity" id="quantity" placeholder="1" />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="rate">Rate</Label>
                  <Input
                    type="amount"
                    name="rate"
                    id="rate"
                    placeholder="$ 0.00"
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="invoiceAmount">Amount</Label>                  
                  <Input
                    type="amount"
                    name="invoiceAmount"
                    id="invoiceAmount"
                    placeholder="$ 0.00"
                  />
                </FormGroup>                
              </Col>
              <button>Add Line Item +</button>
            </Row>

            <FormGroup>
            </FormGroup>

            {/* Notes and Terms */}

            <FormGroup>
              <Label for="notes">Notes</Label>
              <Input
                type="text"
                name="notes"
                id="notes"
                placeholder="Add Notes Here"
              />
            </FormGroup>
            <FormGroup>
              <Label for="terms">Terms</Label>
              <Input
                type="text"
                name="terms"
                id="terms"
                placeholder="Add Terms Here"
              />
            </FormGroup>
        <Button onClick={this.handlesubmit}>Sign in</Button>
        </form>
      </div>
    </div>

    );
  }
}

export default InvoiceForm;
