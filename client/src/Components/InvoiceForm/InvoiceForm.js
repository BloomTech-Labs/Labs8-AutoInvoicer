import React, { Component } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import qs from "qs";
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
  ListGroupItem,
  Table
} from "reactstrap";

import "./InvoiceForm.css";

class InvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.auth0_userID = this.props.auth0_userID;
    this.mongo_id = this.props.mongo_id;
    this.logo = null;
    this.logoRaw = null;
  }
  state = {
    invoice_number: this.props.invoice_num,
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
    taxRate: "",
    shipping: "",
    total: "",
    amount_paid: "",
    notes: "",
    terms: ""
  };

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleImageChange = event => {
    event.preventDefault();
    const reader = new FileReader();
    const logo = event.target.files[0];
    reader.onloadend = () => {
      this.logo = logo;
      this.logoRaw = reader.result;
    };
    reader.readAsDataURL(logo);
  };

  handleSubmit = event => {
    event.preventDefault();
    const newInvoice = new FormData();
    newInvoice.append("auth0_userID", this.auth0_userID);
    newInvoice.append("logo", this.logo, this.logo.name);

    const data = this.state;

    for (const prop in data) {
      newInvoice.append(`${prop}`, `${data[prop]}`);
    }

    axios
      .post(process.env.REACT_APP_NEW_INVOICE, newInvoice)
      .then(res => {
        let invoice_num = this.props.invoice_num;
        axios
          .put(`/api/users/${this.mongo_id}`, {
            invoice_num: (invoice_num += 1)
          })
          .then(res => console.log("invoice added, number incremented"))
          .catch(err => console.log(err));
      })
      .catch(err => {
        console.log("ERROR", err);
      });
    // COMMENTED OUT this is meant to reset the form to blank, but since we're creating two separate buttons for Saving the Invoice and Downloading the PDF, the form data needs to persist
    // TODO this means that we should finish full CRUD for the invoices (we still have yet to make routes for UPDATE and DELETE)
    // this.setState({
    //   invoice_number: "",
    //   date: "",
    //   due_date: "",
    //   balance_due: "",
    //   company_name: "",
    //   invoiceTo: "",
    //   address: "",
    //   zipcode: "",
    //   city: "",
    //   state: "",
    //   item: "",
    //   quantity: "",
    //   rate: "",
    //   amount: "",
    //   subtotal: "",
    //   discount: "",
    //   tax: "",
    //   shipping: "",
    //   total: "",
    //   amount_paid: "",
    //   notes: "",
    //   terms: ""
    // });
  };

  createPDF = event => {
    event.preventDefault();
    console.log(this.logoRaw);
    const pdf = new jsPDF({
      unit: "in",
      format: [8.5, 11]
    });
    pdf.addImage(this.logoRaw, "JPG", 0.5, 0.3, 1.5, 1.5, "MEDIUM", 0);
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
    // pdf.addImage(`${this.state.logo}`, "JPEG", 0.5, 8.4, 100, 100, "logo");

    pdf.save(`${this.state.invoiceTo}`);
  };

  calculateTax() {
    //Calculates the tax rate of the invoice total by using an external tax API.
    //Calculated using the address

    //Turn our data into a querystring
    console.log(this.state);
    const query = qs.stringify({
      line1: this.state.address, //Line 1,2,3 are used for addresses. 2 and 3 are optional
      line2: "",
      line3: "",
      city: this.state.city,
      region: this.state.state,
      postalCode: this.state.zipcode,
      country: "US" //Only works in US for free version
    });

    axios({
      method: "get",
      url: `https://rest.avatax.com/api/v2/taxrates/byaddress?${query}`,
      headers: {
        Accept: "application/json",
        Authorization: process.env.REACT_APP_TAX_AUTH
      }
    })
      .then(res => {
        this.setState({
          tax: this.state.subtotal * res.data.totalRate,
          taxRate: res.data.totalRate
        }); //Our tax is the subtotal * tax rate returned by API
        //FOR SHOWCASE PURPOSES
        let nuTotal = parseInt(this.state.subtotal) + this.state.tax;
        this.setState({ total: nuTotal });
      })
      .catch(error => {
        console.log(error);
      });
  }

  // Handle Tax
  handleTaxChange = event => {
    this.setState(
      { [event.target.name]: event.target.value },
      this.calculateTax
    );
  };

  // Handle Zip Change
  handleZipChange = event => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.calculateTax();
      this.getCityState();
    });
  };

  // Get City State by Zip
  getCityState() {
    let zipcode = this.state.zipcode;
    if (zipcode.toString().length < 5) {
      return;
    } else {
      axios
        .get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: {
            address: zipcode,
            key: process.env.REACT_APP_CITY_STATE
          }
        })
        .then(res => {
          console.log(res);
          let city = res.data.results[0].address_components[1].short_name;
          // let state = res.data.results[0].address_components[2].short_name;
          let state = () => {
            return res.data.results[0].formatted_address
              .split(",")[1]
              .split(" ")[1];
          };
          console.log(`STATE: ${state()}`);
          console.log(`CITY: ${city}`);
          this.setState({
            city: city,
            state: state()
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
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
                type="file"
                name="addLogo"
                id="addLogo"
                accept="image/png, image/jpeg"
                onChange={this.handleImageChange}
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
                    onChange={this.handleZipChange}
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
                    onChange={this.handleTaxChange}
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
                    onChange={this.handleTaxChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Item, Quantity, Rate, Amount - Using Reacstrap Table */}
            <Table striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>
                    <Input
                      value={this.state.item}
                      type="text"
                      name="item"
                      id="item"
                      placeholder="Add Item Here"
                      onChange={this.handleInputChange}
                    />
                  </td>
                  <td>
                    <Input
                      value={this.state.quantity}
                      type="number"
                      name="quantity"
                      id="quantity"
                      placeholder="1"
                      onChange={this.handleInputChange}
                    />
                  </td>
                  <td>
                    <Input
                      value={this.state.rate}
                      type="currency"
                      name="rate"
                      id="rate"
                      placeholder="$ 0.00"
                      onChange={this.handleInputChange}
                    />
                  </td>
                  <td>${this.state.quantity * this.state.rate} </td>
                </tr>
              </tbody>
            </Table>

            <div>
              <button>Add Line Item +</button>
            </div>

            {/* Item, Quantity, Rate, Amount - using Reacstrap FormGroup  */}
            {/* <Row form>
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
                  <Label for="quantity">Quantity</Label>
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
                    type="currency"
                    name="rate"
                    id="rate"
                    placeholder="$ 0.00"
                    onChange={this.handleInputChange}
                  />
                </FormGroup>
              </Col> */}

            {/* Amount */}
            {/* <div>
                <Label for="amount">Amount</Label>
                ${this.state.quantity * this.state.rate}{" "}
              </div> */}

            {/* Amount */}
            {/* <Col md={2}>
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
              </Col> */}

            {/* Add Line Item */}
            {/* <button>Add Line Item +</button> */}
            {/* </Row> */}

            {/* Notes, Tax, Terms */}
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
              <Label for="terms">Subtotal </Label>
              <Input
                value={this.state.subtotal}
                type="number"
                name="subtotal"
                id="subtotal"
                placeholder="Subtotal"
                onChange={this.handleInputChange}
              />
              {/* <div>
                Tax: {this.state.taxRate * 100}%{" "}
                <Button onClick={() => this.calculateTax()}>
                  {" "}
                  Calculate Tax
                </Button>
              </div> */}
              {/* Testing Tax */}
              <div>Tax: {(this.state.taxRate * 100).toFixed(2)}% </div>
              <div>Total: {this.state.total} </div>
            </FormGroup>
            <Button type="generate" onClick={this.handleSubmit}>
              Save Invoice
            </Button>
            <Button
              className="download-pdf-button"
              type="generate"
              onClick={this.createPDF}
            >
              Download PDF
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default InvoiceForm;
