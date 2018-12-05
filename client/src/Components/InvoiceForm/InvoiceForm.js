import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import jsPDF from "jspdf";
import 'jspdf-autotable';

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

import LineItems from "./LineItems/LineItems";

import "./InvoiceForm.css";
import LandingPage from "../Landing/LandingOld";

class InvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.auth0_userID = this.props.auth0_userID;
    this.mongo_id = this.props.mongo_id;
    this.logo = null;
    this.logoRaw = null;
    this.invalidForm = false;
    this.edit = false;
    this.errMessage = '';
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
    amount: "",
    subtotal: "",
    discount: "",
    tax: "",
    taxRate: "",
    shipping: "",
    total: "",
    amount_paid: "",
    notes: "",
    terms: "",
    lineItems: [
      {
        item: "",
        quantity: 0,
        rate: 0
      }
    ],
    edit: false,
    toDashboard: false
  };

  async componentDidMount() {
    const path = this.props.path;

    if (path === "/invoices/:id") {
      const params = this.props.params;
      this.edit = true;
      const invoice = (await axios.get(process.env.REACT_APP_NEW_INVOICE + `/${params.id}`)).data;
      for(const item in invoice){
        if(item === 'line_items'){
          let copyArray = [];
          invoice[item].forEach(lineItem => {
            copyArray.push(lineItem);
          })
          this.setState({lineItems: copyArray});
        }
        else
          this.setState({[item]: invoice[item]})
      }
    }
  }

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

    const data = this.state;

    if(!this.logo){
      this.invalidForm = true;
      this.errMessage = "Please submit a valid logo file."
      this.setState({});
      this.invalidForm = false;
      return;
    }

    const formErrorValues = {
      date : "Date",
      due_date: "Due Date",
      balance_due: "Balance Due",
      company_name: "Invoice From",
      invoiceTo: "Invoice To",
      address: "Address",
      zipcode: "Zip",
      city: "City",
      state: "State",
    }

    for(const item in formErrorValues) {
      if(data[item] === '' || data[item] === 'null'){
          this.invalidForm = true;
          this.errMessage = `Please fill in the ${formErrorValues[item]} field.`
          this.setState({});
          this.invalidForm = false;
          return;
      }
    }

    if(isNaN(data.total)){
      this.invalidForm = true;
      this.errMessage = "Please add at least one item."
      this.setState({});
      this.invalidForm = false;
      return;
    }
    
    const newInvoice = new FormData();
    newInvoice.append("auth0_userID", this.auth0_userID);
    newInvoice.append("logo", this.logo, this.logo.name);
   

    for (const prop in data) {
      if (prop === "lineItems") {
        newInvoice.append(`${prop}`, JSON.stringify(data[prop]));
      } else {
        newInvoice.append(`${prop}`, `${data[prop]}`);
      }
    }

    this.setState({ toDashboard: true });

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
          this.setState({});
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

  handleUpdate = event => {
    event.preventDefault();

    const data = this.state;

    if(!this.logo){
      this.invalidForm = true;
      this.errMessage = "Please submit a valid logo file."
      this.setState({});
      this.invalidForm = false;
      return;
    }

    const formErrorValues = {
      date : "Date",
      due_date: "Due Date",
      balance_due: "Balance Due",
      company_name: "Invoice From",
      invoiceTo: "Invoice To",
      address: "Address",
      zipcode: "Zip",
      city: "City",
      state: "State",
    }

    for(const item in formErrorValues) {
      if(data[item] === '' || data[item] === 'null'){
          this.invalidForm = true;
          this.errMessage = `Please fill in the ${formErrorValues[item]} field.`
          this.setState({});
          this.invalidForm = false;
          return;
      }
    }

    if(isNaN(data.total)){
      this.invalidForm = true;
      this.errMessage = "Please add at least one item."
      this.setState({});
      this.invalidForm = false;
      return;
    }

    const newInvoice = new FormData();
    newInvoice.append("auth0_userID", this.auth0_userID);
    newInvoice.append("logo", this.logo, this.logo.name);

    const params = this.props.params;

    for (const prop in data) {
      if (prop === 'lineItems') 
        newInvoice.append(`${prop}`, JSON.stringify(data[prop]))
      else
        newInvoice.append(`${prop}`, `${data[prop]}`);
    }
    console.log(newInvoice);
    axios
      .put(process.env.REACT_APP_NEW_INVOICE + `/${params.id}`, newInvoice)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log("ERROR", err);
      });
  };

  createPDF = event => {
    event.preventDefault();
    console.log(this.logoRaw);
    const pdf = new jsPDF('p', 'pt');
    pdf.setFontSize(12);
    const columns = [
      {title: "#", dataKey: "#"},
      {title: "Item", dataKey: "item"},
      {title: "Quantity", dataKey: "quantity"},
      {title: "Rate", dataKey: "rate"},
      {title: "Amount", dataKey: "amount"},
    ];
    const rows = [];
    this.state.lineItems.map((row, index) => {
      rows.push(
        {"#": index + 1, "item": row.item, "quantity": row.quantity, "rate": `$${row.rate}`, "amount": `$${row.quantity * row.rate}`}
      )
    })
    pdf.addImage(this.logoRaw, "JPEG", 30, 15, 75, 75, "MEDIUM", 0);
    pdf.text(this.state.company_name, 30, 105);
    pdf.text("Date:", 450, 50);
    pdf.text(this.state.date, 500, 50);
    pdf.text("Invoice Number:", 391, 65);
    pdf.text(`${this.state.invoice_number}`, 500, 65);
    pdf.text("Due Date:", 425, 80);
    pdf.text(this.state.due_date, 500, 80)
    pdf.text("Bill to:", 30, 155);
    pdf.text(this.state.invoiceTo, 30, 170);
    pdf.text(this.state.address, 30, 185);
    pdf.text(`${this.state.city}, ${this.state.state} ${this.state.zipcode}`, 30, 200);
    pdf.autoTable(columns, rows, {margin: {top: 300}});
    pdf.text("Discount:", 414, 670);
    pdf.text(this.state.discount, 500, 670);
    pdf.text("Shipping:", 414, 685);
    pdf.text(`$${this.state.shipping}`, 500, 685);
    pdf.text("Subtotal:", 417, 700);
    pdf.text(`$${this.state.subtotal}`, 500, 700);
    pdf.text("Tax:", 440, 715);
    pdf.text(`$${this.state.subtotal * this.state.taxRate}`, 500, 715);
    pdf.text("Balance Due:", 391, 730);
    pdf.text(`$${this.state.balance_due}`, 500, 730);
    pdf.text("Notes -", 30, 745);
    pdf.text(this.state.notes, 75, 745);
    pdf.text("Terms -", 30, 760);
    pdf.text(this.state.terms, 75, 760);
    // pdf.text(`Invoice Number: ${this.state.invoice_number}`, 13, 0.8);
    // pdf.text(`Date: ${this.state.date}`, 13, 1.1);
    // pdf.text(`Due Date: ${this.state.due_date}`, 13, 1.4);
    // pdf.text(`Balance Due: ${this.state.balance_due}`, 13, 1.7);
    // pdf.text(`Company Name: ${this.state.company_name}`, 13, 2.1);
    // pdf.text(`Invoice To: ${this.state.invoiceTo}`, 13, 2.4);
    // pdf.text(`Address: ${this.state.address}`, 13, 2.7);
    // pdf.text(`Zip: ${this.state.zipcode}`, 13, 3.1);
    // pdf.text(`City: ${this.state.city}`, 13, 3.4);
    // pdf.text(`State: ${this.state.state}`, 13, 3.7);
    // pdf.autoTable(columns, rows);
    // // this.state.lineItems.map(row => {
    // //   pdf.text(`Item: ${row.item}`, 13, `${(this.y_position / 2) + 2.54}`);
    // //   pdf.text(`Quantity: ${row.quantity}`, 2, `${(this.y_position / 2) + 2.54}`);
    // //   pdf.text(`Rate: ${row.rate}`, 3.5, `${(this.y_position / 2) + 2.54}`);
    // //   pdf.text(`Amount: $${row.quantity * row.rate}`, 4.5, `${(this.y_position / 2) + 2.54}`);
    // //   ++this.y_position
    // // })
    // pdf.text(`Subtotal: $${this.state.subtotal}`, 13, `${(this.y_position / 2) + 0.4}`);
    // pdf.text(`Discount: ${this.state.discount}`, 13, `${(this.y_position / 2) + 0.7}`);
    // pdf.text(`Tax: $${this.state.tax}`, 13, `${(this.y_position / 2) + 1.1}`);
    // pdf.text(`Tax Rate: ${this.state.taxRate * 100}%`, 13, `${(this.y_position / 2) + 1.4}`);
    // pdf.text(`Shipping: ${this.state.shipping}`, 13, `${(this.y_position / 2) + 1.7}`);
    // pdf.text(`Total: $${this.state.total}`, 13, `${(this.y_position / 2) + 2.1}`);
    // pdf.text(`Amount Paid: $${this.state.amount_paid}`, 13, `${(this.y_position / 2) + 2.4}`);
    // pdf.text(`Notes: ${this.state.notes}`, 13, `${(this.y_position / 2) + 2.7}`);
    // pdf.text(`Terms: ${this.state.terms}`, 13, `${(this.y_position / 2) + 3.1}`);

    pdf.save(`Invoice${this.state.invoice_number}`);
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

  addLineItem = event => {
    event.preventDefault();
    const newLineItem = {
      item: "",
      quantity: 0,
      rate: 0
    };
    this.setState({ lineItems: [...this.state.lineItems, newLineItem] });
  };

  handleLineItemChange = (event, index, item) => {
    let lineItems = [...this.state.lineItems];
    lineItems[index][item] = event.target.value;
    this.setState({ lineItems });
  };

  render() {
    if (this.state.toDashboard === true) {
      return <Redirect to="/" />;
    }

    console.log(this.state.toDashboard);

    return (
      <div>
        {/* <TopNav /> */}
        {/* <Navbar /> */}
        <div className="form-container1">
          <form>
            {/* Add Logo */}
            <FormGroup>
              {/* <Label for="addLogo">Add Your Logo</Label> */}
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
              {/* <Label for="invoice_number" sm={2}>
                Invoice Number
              </Label> */}
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
              {/* <Label for="date" sm={2}>
                Date
              </Label> */}
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
              {/* <Label for="due_date" sm={2}>
                Due Date
              </Label> */}
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
              {/* <Label for="balance_due" sm={2}>
                Balance Due
              </Label> */}
              <Col sm={4}>
                <Input
                  value={this.state.balance_due}
                  type="number"
                  name="balance_due"
                  id="balance_due"
                  placeholder="Balance Due"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            {/* Invoice Customer Company Details */}
            <FormGroup>
              {/* <Label for="company_name">Invoice From</Label> */}
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
              {/* <Label for="invoiceTo">Invoice To</Label> */}
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
              {/* <Label for="address">Address</Label> */}
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
                  {/* <Label for="zipcode">Zip</Label> */}
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
                  {/* <Label for="city">City</Label> */}
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
                  {/* <Label for="state">State</Label> */}
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
            <Table striped id="line-items-table">
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
                {this.state.lineItems.map((row, index) => {
                  return (
                    <LineItems
                      key={index}
                      rowNumber={index + 1}
                      item={row.item}
                      quantity={row.quantity}
                      rate={row.rate}
                      handleLineItemChange={this.handleLineItemChange}
                    />
                  );
                })}
                {/* <tr>
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
                </tr> */}
              </tbody>
            </Table>
            {/* Add Line Item */}
            <div>
              <button onClick={this.addLineItem}>Add Line Item +</button>
            </div>
            {/* Commented out the following lines below while testing the compatibility of the Reactstrap Table.  */}
            {/* Item, Quantity, Rate, Amount - using Reacstrap FormGroup */}
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
              </Col>
            </Row> */}
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
            {/* </Row>

            {/* Subtotal*/}
            {/* <div classname="subtotal">
            Subtotal: $
            </div> */}
            {/* Notes & Terms*/}
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
            {/* Discount */}
            <FormGroup row>
              <Label for="discount" sm={2}>
                Discount
              </Label>
              <Col sm="2">
                <Input
                  value={this.state.subtotal * (1 - this.state.discount / 100)}
                  type="percent"
                  name="discount"
                  id="discount"
                  placeholder="0 %"
                />
              </Col>
            </FormGroup>
            {/* Shipping */}
            <FormGroup row>
              <Label for="shipping" sm={2}>
                Shipping
              </Label>
              <Col sm="2">
                {/* <Col sm={10}> */}
                <Input
                  value={this.state.shipping}
                  type="number"
                  name="discount"
                  id="discount"
                  placeholder="$ 0.00"
                />
              </Col>
            </FormGroup>
            {/* Subtotal */}
            <FormGroup row>
              <Label for="subtotal" sm={2}>
                Subtotal
              </Label>
              <Col sm="2">
                <Input
                  value={this.state.subtotal}
                  type="number"
                  name="subtotal"
                  id="subtotal"
                  placeholder="$ 0.00"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            {/* <FormGroup>
              <Label for="terms">Subtotal </Label>
              <Input
                value={this.state.subtotal}
                type="number"
                name="subtotal"
                id="subtotal"
                placeholder="Subtotal"
                onChange={this.handleInputChange}
              /> */}
            {/* Tax with generate tax button */}
            {/* <div>
                Tax: {this.state.taxRate * 100}%{" "}
                <Button onClick={() => this.calculateTax()}>
                  {" "}
                  Calculate Tax
                </Button>
              </div> */}
            {/* Testing Tax */}
            <div>Tax: {(this.state.taxRate * 100).toFixed(2)}% </div>
            <div>Total: {this.state.total} </div>({/*</FormGroup> */}
            {this.edit ? (
              <Button type="generate" onClick={this.handleUpdate}>
                Update Invoice
              </Button>
            ) : (
              <Button type="generate" onClick={this.handleSubmit}>
                Save Invoice
              </Button>
            )}

            <Button
              className="download-pdf-button"
              type="generate"
              onClick={this.createPDF}
            >
              Download PDF
            </Button>
            <div className='form-error'>{this.errMessage}</div>
          </form>
        </div>
      </div>
    );
  }
}

export default InvoiceForm;
