import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import qs from 'qs';


import {
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap";

// import "./InvoiceForm.css";

// class InvoiceForm extends Component {
export default class InvoiceForm extends React.Component {
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
      <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="exampleEmail">Email</Label>
              <Input
                type="email"
                name="email"
                id="exampleEmail"
                placeholder="with a placeholder"
              />
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="examplePassword">Password</Label>
              <Input
                type="password"
                name="password"
                id="examplePassword"
                placeholder="password placeholder"
              />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup>
          <Label for="exampleAddress">Address</Label>
          <Input
            type="text"
            name="address"
            id="exampleAddress"
            placeholder="1234 Main St"
          />
        </FormGroup>
        <FormGroup>
          <Label for="exampleAddress2">Address 2</Label>
          <Input
            type="text"
            name="address2"
            id="exampleAddress2"
            placeholder="Apartment, studio, or floor"
          />
        </FormGroup>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="exampleCity">City</Label>
              <Input type="text" name="city" id="exampleCity" />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="exampleState">State</Label>
              <Input type="text" name="state" id="exampleState" />
            </FormGroup>
          </Col>
          <Col md={2}>
            <FormGroup>
              <Label for="exampleZip">Zip</Label>
              <Input type="text" name="zip" id="exampleZip" />
            </FormGroup>
          </Col>
        </Row>
        <FormGroup check>
          <Input type="checkbox" name="check" id="exampleCheck" />
          <Label for="exampleCheck" check>
            Check me out
          </Label>
        </FormGroup>
        <Button onClick={this.handlesubmit}>Sign in</Button>
      </Form>
    );
  }
}

// export default NewInvoice;
