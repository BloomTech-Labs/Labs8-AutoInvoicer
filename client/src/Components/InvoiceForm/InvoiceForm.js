import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import qs from 'qs';
import jsPDF from "jspdf";

import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  ListGroup, 
  ListGroupItem
} from "reactstrap";

import "./InvoiceForm.css";
import Navbar from "../Navbar/Navbar";
import TopNav from "../TopNav/TopNav";
import Axios from "axios";

class InvoiceForm extends Component {
  state = {
    logo: "",
    invoice_number: "",
    date: "",
    due_date: "",
    balance_due: "",
    company_name: "",
    invoiceTo: "",
    address: "",
    zipcode: "",
    city: "",
    state: "",
    item: "",
    quantity: "",
    rate: "",
    amount: "",
    subtotal: "",
    discount: "",
    tax: "",
    taxRate:"",
    shipping: "",
    total: "",
    amount_paid: "",
    notes: "",
    terms: ""
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const {
      logo,
      invoice_number,
      date,
      due_date,
      balance_due,
      company_name,
      invoiceTo,
      address,
      zipcode,
      city,
      state,
      item,
      quantity,
      rate,
      amount,
      subtotal,
      discount,
      tax,
      taxRate,
      shipping,
      total,
      amount_paid,
      notes,
      terms
    } = { ...this.state };

    const newInvoice = {
<<<<<<< HEAD
      user: this.props.user.user_id.split("|")[1],
=======
      logo,
>>>>>>> 77d9d2b871e42971d03cf77f3e0d769d6324ff2b
      invoice_number,
      date,
      due_date,
      balance_due,
      company_name,
      invoiceTo,
      address,
      zipcode,
      city,
      state,
      item,
      quantity,
      rate,
      amount,
      subtotal,
      discount,
      tax,
      taxRate,
      shipping,
      total,
      amount_paid,
      notes,
      terms
    };

    const pdf = new jsPDF({
      unit: "in",
      format: [8.5, 11]
    });
    pdf.text(`Invoice Number: ${this.state.invoice_number}`, 0.5, 0.8);
    pdf.text(`Date: ${this.state.date}`, 0.5, 1.1);
    pdf.text(`Due Date: ${this.state.due_date}`, 0.5, 1.4);
    pdf.text(`Balance Due: ${this.state.balance_due}`, 0.5, 1.7);
    pdf.text(`Company Name: ${this.state.company_name}`, 0.5, 2.1);
    pdf.text(`Invoice To: ${this.state.invoiceTo}`, 0.5, 2.4);
    pdf.text(`Address: ${this.state.address}`, 0.5, 2.7);
    pdf.text(`Zip: ${this.state.zipcode}`, 0.5, 3.1);
    pdf.text(`City: ${this.state.city}`, 0.5, 3.4);
    pdf.text(`State: ${this.state.state}`, 0.5, 3.7);
    pdf.text(`Item: ${this.state.item}`, 0.5, 4.1);
    pdf.text(`Quantity: ${this.state.quantity}`, 0.5, 4.4);
    pdf.text(`Rate: ${this.state.rate}`, 0.5, 4.7);
    pdf.text(`Amount: $${this.state.amount}`, 0.5, 5.1);
    pdf.text(`Subtotal: $${this.state.subtotal}`, 0.5, 5.4);
    pdf.text(`Discount: ${this.state.discount}`, 0.5, 5.7);
    pdf.text(`Tax: $${this.state.tax}`, 0.5, 6.1);
    pdf.text(`Tax Rate: ${this.state.taxRate * 100}%`, 0.5, 6.4);
    pdf.text(`Shipping: ${this.state.shipping}`, 0.5, 6.7);
    pdf.text(`Total: $${this.state.total}`, 0.5, 7.1);
    pdf.text(`Amount Paid: $${this.state.amount_paid}`, 0.5, 7.4);
    pdf.text(`Notes: ${this.state.notes}`, 0.5, 7.7);
    pdf.text(`Terms: ${this.state.terms}`, 0.5, 8.1);
    pdf.addImage(`${this.state.logo}`, 'JPEG', 0.5, 8.4, 100, 100, 'logo');

    pdf.save(`${this.state.invoiceTo}`);
  
    axios.post('http://localhost:8000/api/invoices', newInvoice)
      .then(res => {
        console.log(res, 'Invoice added!');
        console.log('NEW INVOICE: ', newInvoice);
        console.log("Invoice from: ", this.state.company_name);
      })
      .catch(err => {
      console.log("ERROR", err);
      });
      this.setState({
        invoice_number: "",
        date: "",
        due_date: "",
        balance_due: "",
        company_name: "",
        invoiceTo: "",
        address: "",
        zipcode: "",
        city: "",
        state: "",
        item: "",
        quantity: "",
        rate: "",
        amount: "",
        subtotal: "",
        discount: "",
        tax: "",
        shipping: "",
        total: "",
        amount_paid: "",
        notes: "",
        terms: ""
      });
  };

  calculateTax() {
    //Calculates the tax rate of the invoice total by using an external tax API.
    //Calculated using the address

    //Turn our data into a querystring
    console.log(this.state);
    const query = qs.stringify({
      line1: this.state.address, //Line 1,2,3 are used for addresses. 2 and 3 are optional
      line2: '',
      line3: '',
      city: this.state.city,
      region: this.state.state,
      postalCode: this.state.zipcode,
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
        this.setState({ tax: this.state.subtotal * res.data.totalRate, taxRate: res.data.totalRate }); //Our tax is the subtotal * tax rate returned by API
        //FOR SHOWCASE PURPOSES
        let nuTotal = parseInt(this.state.subtotal) + this.state.tax
        this.setState({total: nuTotal});
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
              <Input 
                value={this.state.logo}
                type="file" 
                name="addLogo" 
                id="addLogo"
                onChange={this.handleInputChange}

              />
              <FormText color="muted">
                Browse file to add your company logo.
              </FormText>
            </FormGroup>

            {/* Invoice Header Rigth Side */}
            <FormGroup row classname="right-indent">
              <Label for="invoice_number" sm={2}>
                Invoice Number
              </Label>
              <Col sm={4}>
                <Input
                  value={this.state.invoice_number}
                  type="number"
                  name="invoice_number"
                  id="invoice_number"
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
              <Label for="due_date" sm={2}>
                Due Date
              </Label>
              <Col sm={4}>
                <Input
                  value={this.state.due_date}
                  type="date"
                  name="due_date"
                  id="due_date"
                  placeholder="Due Date"
                  onChange={this.handleInputChange}
                />
              </Col>
              <Label for="balance_due" sm={2}>
                Balance Due
              </Label>
              <Col sm={4}>
                <Input
                  value={this.state.balance_due}
                  type="number"
                  name="balance_due"
                  id="balance_due"
                  placeholder="$ 0.00"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>

            {/* Invoice Customer Company Details */}
            <FormGroup>
              <Label for="company_name">Invoice From</Label>
              <Input
                value={this.state.company_name}
                type="text"
                name="company_name"
                id="company_name"
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
                  <Label for="zipcode">Zip</Label>
                  <Input
                    value={this.state.zipcode}
                    type="text" 
                    name="zipcode" 
                    id="zipcode" 
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
                  <Label for="state">State</Label>
                  <Input
                    value={this.state.state}
                    type="text"
                    name="state"
                    id="state"
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
            <FormGroup>
             <Label for="terms">SubTotal </Label>
             <Input
                value={this.state.subtotal}
                type="number"
                name="subtotal"
                id="subtotal"
                placeholder="Subtotal"
                onChange={this.handleInputChange}
              />
              <div>Tax: {this.state.taxRate * 100}% <Button onClick={() => this.calculateTax()}> Calculate Tax</Button></div>
              <div>Total: {this.state.total} </div>
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
