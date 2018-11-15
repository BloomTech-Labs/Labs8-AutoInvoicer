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
import Axios from "axios";

class InvoiceForm extends Component {
  state = {
    invoiceNumber: "",
    date: "",
    dueDate: "",
    balanceDue: "",
    invoiceFrom: "",
    invoiceTo: "",
    address: "",
    zip: "",
    city: "",
    cityState: "",
    item: "",
    quantity: "",
    rate: "",
    amount: "",
    subtotal: "",
    discount: "",
    tax: "",
    shipping: "",
    total: "",
    amountPaid: "",
    notes: "",
    terms: ""
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      invoiceNumber,
      date,
      dueDate,
      balanceDue,
      invoiceFrom,
      invoiceTo,
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
      tax,
      shipping,
      total,
      amountPaid,
      notes,
      terms
    } = { ...this.state };

    const newInvoice = {
      invoiceNumber,
      date,
      dueDate,
      balanceDue,
      invoiceFrom,
      invoiceTo,
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
      tax,
      shipping,
      total,
      amountPaid,
      notes,
      terms
    };

    this.calculateTax();
  
    axios.post('http://localhost:/8000/api/invoices', newInvoice);
      .then(res => {
        console.log(res, 'Invoice added!');
      })
      .catch(err => {
      console.log("ERROR", err);
      });
      this.setState({
        invoiceNumber: "",
        date: "",
        dueDate: "",
        balanceDue: "",
        invoiceFrom: "",
        invoiceTo: "",
        address: "",
        zip: "",
        city: "",
        cityState: "",
        item: "",
        quantity: "",
        rate: "",
        amount: "",
        subtotal: "",
        discount: "",
        tax: "",
        shipping: "",
        total: "",
        amountPaid: "",
        notes: "",
        terms: ""
      });
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
              <Input type="file" name="addLogo" id="addLogo" />
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
                  value={this.state.invoiceNumber}
                  type="number"
                  name="invoiceNumber"
                  id="invoiceNumber"
                  placeholder="Invoice Number"
                  onChange={this.handleInputChange}
                />
              </Col>
              <Label for="date" sm={2}>
                Date
              </Label>
              <Col sm={4}>
                <Input
                  value={this.state.date}
                  type="date" 
                  name="date" 
                  id="date" 
                  placeholder="Date"
                  onChange={this.handleInputChange}
                />
              </Col>
              <Label for="dueDate" sm={2}>
                Due Date
              </Label>
              <Col sm={4}>
                <Input
                  value={this.state.dueDate}
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  placeholder="Due Date"
                  onChange={this.handleInputChange}
                />
              </Col>
              <Label for="balanceDue" sm={2}>
                Balance Due
              </Label>
              <Col sm={4}>
                <Input
                  value={this.state.balanceDue}
                  type="number"
                  name="balanceDue"
                  id="balanceDue"
                  placeholder="$ 0.00"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>

            {/* Invoice Customer Company Details */}
            <FormGroup>
              <Label for="invoiceFrom">Invoice From</Label>
              <Input
                value={this.state.invoiceFrom}
                type="text"
                name="invoiceFrom"
                id="invoiceFrom"
                placeholder="Invoice From"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="invoiceTo">Invoice To</Label>
              <Input
                value={this.state.invoiceTo}
                type="text"
                name="invoiceTo"
                id="invoiceTo"
                placeholder="Invoice To"
                onChange={this.handleInputChange}
              />
            </FormGroup>

            {/* Address, State, Zip */}
            <FormGroup>
              <Label for="address">Address</Label>
              <Input
                value={this.state.address}
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <Row form>
              <Col md={2}>
                <FormGroup>
                  <Label for="zip">Zip</Label>
                  <Input
                    value={this.state.zip}
                    type="text" 
                    name="zip" 
                    id="zip" 
                    placeholder="Zip"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="city">City</Label>
                  <Input 
                    value={this.state.city}
                    type="text" 
                    name="city" 
                    id="city" 
                    placeholder="City"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label for="cityState">State</Label>
                  <Input
                    value={this.state.cityState}
                    type="text"
                    name="cityState"
                    id="cityState"
                    placeholder="State"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Items and Cost */}
            <Row form>
              <Col md={6}>
                <FormGroup>
                  <Label for="item">Item</Label>
                  <Input
                    value={this.state.item}
                    type="text"
                    name="item"
                    id="item"
                    placeholder="Add Item Here"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="quanity">Quantity</Label>
                  <Input
                    value={this.state.quantity}
                    type="number"
                    name="quantity"
                    id="quantity"
                    placeholder="1"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="rate">Rate</Label>
                  <Input
                    value={this.state.rate}
                    type="number"
                    name="rate"
                    id="rate"
                    placeholder="$ 0.00"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={2}>
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    value={this.state.amount}
                    type="number"
                    name="amount"
                    id="amount"
                    placeholder="$ 0.00"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col>
              <button>Add Line Item +</button>
            </Row>

            <FormGroup />

            {/* Notes and Terms */}
            <FormGroup>
              <Label for="notes">Notes</Label>
              <Input
                value={this.state.notes}
                type="text"
                name="notes"
                id="notes"
                placeholder="Add Notes Here"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="terms">Terms</Label>
              <Input
                value={this.state.terms}
                type="text"
                name="terms"
                id="terms"
                placeholder="Add Terms Here"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <Button type="generate" onClick={this.handleSubmit}>
              Generate
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default InvoiceForm;
