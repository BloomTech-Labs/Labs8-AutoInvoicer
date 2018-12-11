import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import jsPDF from "jspdf";
import accounting from "accounting";
import "jspdf-autotable";

import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  FormText,
  ListGroup,
  ListGroupItem,
  Table
} from "reactstrap";

import LineItems from "./LineItems/LineItems";

import "./InvoiceForm.css";

class InvoiceForm extends Component {
  constructor(props) {
    super(props);
    this.auth0_userID = this.props.auth0_userID;
    this.mongo_id = this.props.mongo_id;
    this.logo = null;
    this.logoRaw = null;
    this.invalidForm = false;
    this.edit = false;
    this.logoRef = React.createRef();
  }
  state = {
    invoice_number: this.props.invoice_num,
    date: "",
    due_date: "",
    balance_due: 0,
    company_name: "",
    invoiceTo: "",
    address: "",
    zipcode: "",
    city: "",
    state: "",
    amount: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    taxRate: 0,
    shipping: 0,
    total: "",
    amount_paid: 0,
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
    toDashboard: false,
    errorMessages: [],
    disabled: true
  };

  async componentDidMount() {
    const path = this.props.path;

    if (path === "/invoices/:id") {
      const params = this.props.params;
      this.edit = true;
      const invoice = (await axios.get(
        process.env.REACT_APP_NEW_INVOICE + `/${params.id}`
      )).data;
      for (const item in invoice) {
        if (item === "line_items") {
          let copyArray = [];
          invoice[item].forEach(lineItem => {
            copyArray.push(lineItem);
          });
          this.setState({ lineItems: copyArray });
        } else if (item === "date" || item === "due_date")
          this.setState({ [item]: invoice[item].substring(0, 10) });
        else this.setState({ [item]: invoice[item] });
      }

      this.logo = this.state.logo;

      this.logoRef.current.src = window.URL.createObjectURL(
        (await axios.get(this.logo, { responseType: "blob" })).data
      );

      this.calculateTotal();
    }
  }

  handleInputChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (
      event.target.name === "shipping" ||
      event.target.name === "discount" ||
      event.target.name === "tax"
    ) {
      this.calculateSubtotal();
    }
  };

  handleImageChange = event => {
    event.preventDefault();
    const reader = new FileReader();
    this.logo = event.target.files[0];
    this.logoRef.current.src = window.URL.createObjectURL(this.logo);
  };

  validateForm = () => {
    const data = this.state;
    const errCache = [];

    const formErrorValues = {
      date: "Date",
      due_date: "Due Date",
      balance_due: "Balance Due",
      company_name: "Invoice From",
      invoiceTo: "Invoice To",
      address: "Address",
      zipcode: "Zip",
      city: "City",
      state: "State"
    };

    for (const item in formErrorValues) {
      if (data[item] === "" || data[item] === "null")
        errCache.push(`Please fill in the ${formErrorValues[item]} field.`);
    }

    if (isNaN(data.total)) {
      errCache.push("Please add at least one item.");
    }


    const newInvoice = new FormData();
    const unusedData = ["edit", "toDashboard", "errorMessages", "disabled"];


    newInvoice.append("auth0_userID", this.auth0_userID);

    if (this.logo) {
      if (typeof this.logo !== "string") {
        newInvoice.append("logo", this.logo, this.logo.name);
      }
    }

    for (const prop in data) {
      if (prop === "lineItems") {
        newInvoice.append(`${prop}`, JSON.stringify(data[prop]));
      } else if (!unusedData.includes(prop)) {
        newInvoice.append(`${prop}`, `${data[prop]}`);
      }
    }

    
    this.setState({ errorMessages: errCache });
    if (errCache.length > 0) return null;
    return newInvoice;
  };

  handleSubmit = event => {
    event.preventDefault();
    const newInvoice = this.validateForm();

    if (newInvoice) {
      axios
        .post(process.env.REACT_APP_NEW_INVOICE, newInvoice)
        .then(res => {
          let invoice_num = this.props.invoice_num;
          axios
            .put(`/api/users/${this.mongo_id}`, {
              invoice_num: (invoice_num += 1)
            })
            .then(res => {
              this.setState({ toDashboard: true });
            })
            .catch(err => console.log(err));
          this.setState({});
        })
        .catch(err => {
          console.log("ERROR", err);
        });
    }
  };

  handleUpdate = event => {
    event.preventDefault();
    const newInvoice = this.validateForm();

    const params = this.props.params;

    if(newInvoice){
      axios
      .put(process.env.REACT_APP_NEW_INVOICE + `/${params.id}`, newInvoice)
      .then(res => {
        this.setState({ toDashboard: true });
      })
      .catch(err => {
        console.log("ERROR", err);
      });
    }
  };

  createPDF = event => {
    event.preventDefault();
    const pdf = new jsPDF("p", "pt");
    pdf.setFontSize(12);
    const columns = [
      { title: "#", dataKey: "#" },
      { title: "Item", dataKey: "item" },
      { title: "Quantity", dataKey: "quantity" },
      { title: "Rate", dataKey: "rate" },
      { title: "Amount", dataKey: "amount" }
    ];
    const rows = [];
    this.state.lineItems.map((row, index) => {
      rows.push({
        "#": index + 1,
        item: row.item,
        quantity: row.quantity,
        rate: `$${row.rate}`,
        amount: `$${row.quantity * row.rate}`
      });
    });

    if (!this.state.disabled) {
      pdf.addImage(this.logoRef.current, "JPEG", 30, 15, 75, 75, "MEDIUM", 0);
    }
    pdf.text(this.state.company_name, 30, 105);
    pdf.text("Invoice Date:", 408, 50);
    pdf.text(this.state.date, 500, 50);
    pdf.text("Invoice Number:", 391, 65);
    pdf.text(`${this.state.invoice_number}`, 500, 65);
    pdf.text("Due Date:", 425, 80);
    pdf.text(this.state.due_date, 500, 80);
    pdf.text("Bill to:", 30, 155);
    pdf.text(this.state.invoiceTo, 30, 170);
    pdf.text(this.state.address, 30, 185);
    pdf.text(
      `${this.state.city}, ${this.state.state} ${this.state.zipcode}`,
      30,
      200
    );
    pdf.autoTable(columns, rows, { margin: { top: 300 } });
    pdf.text("Discount:", 414, 640);
    pdf.text(`${this.state.discount}%`, 500, 640);
    pdf.text("Shipping:", 414, 655);
    pdf.text(`$${this.state.shipping}`, 500, 655);
    pdf.text("Subtotal:", 417, 670);
    pdf.text(`$${this.state.subtotal}`, 500, 670);
    pdf.text("Tax:", 441, 685);
    pdf.text(
      `$${(this.state.subtotal * this.state.taxRate).toFixed(2)}`,
      500,
      685
    );
    pdf.text("Total:", 435, 700);
    pdf.text(`$${this.state.total.toFixed(2)}`, 500, 700);
    pdf.text("Amount Paid:", 393, 715);
    pdf.text(`$${this.state.amount_paid}`, 500, 715);
    pdf.text("Balance Due:", 393, 730);
    pdf.text(`$${this.state.balance_due.toFixed(2)}`, 500, 730);
    pdf.text("Notes -", 30, 745);
    pdf.text(this.state.notes, 75, 745);
    pdf.text("Terms -", 30, 760);
    pdf.text(this.state.terms, 75, 760);

    pdf.save(`Invoice${this.state.invoice_number}`);
  };

  calculateSubtotal() {
    let tempSubtotal = 0;

    for (let i = 0; i < this.state.lineItems.length; i++) {
      if (
        this.state.lineItems[i].quantity >= 0 &&
        this.state.lineItems[i].rate >= 0
      )
        tempSubtotal +=
          this.state.lineItems[i].quantity * this.state.lineItems[i].rate;
    }

    this.setState({ subtotal: tempSubtotal }, this.calculateTotal);
  }

  calculateTotal() {
    //Calculates the tax rate of the invoice total by using an external tax API.
    //Calculated using the zipcode

    //Turn our data into a querystring
    const query = qs.stringify({
      // line1: this.state.address, //Line 1,2,3 are used for addresses. 2 and 3 are optional
      // line2: "",
      // line3: "",
      // city: this.state.city,
      // region: this.state.state,
      postalCode: this.state.zipcode,
      country: "US" //Only works in US for free version
    });

    let discount = this.state.discount;
    let shipping = this.state.shipping;
    let subtotal = this.state.subtotal;
    let amount_paid = this.state.amount_paid;
    discount = discount || 0;
    shipping = shipping || 0;
    amount_paid = amount_paid || 0;

    if (this.state.zipcode.length === 5) {
      axios({
        method: "get",
        url: `https://rest.avatax.com/api/v2/taxrates/byaddress?${query}`,
        headers: {
          Accept: "application/json",
          Authorization: process.env.REACT_APP_TAX_AUTH
        }
      })
        .then(res => {
          const tax = subtotal * res.data.totalRate;
          const taxRate = res.data.totalRate;

          //Our tax is the subtotal * tax rate returned by API
          //FOR SHOWCASE PURPOSES

          let newTotal =
            parseFloat(subtotal) * (1 - discount / 100) +
            parseFloat(tax) +
            parseFloat(shipping);
          this.setState({
            total: newTotal,
            balance_due: newTotal - amount_paid,
            tax,
            taxRate
          });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const tax = subtotal * this.state.taxRate;

      let total =
        parseFloat(subtotal) * (1 - discount / 100) +
        parseFloat(tax) +
        parseFloat(shipping);
      this.setState({
        total: total,
        balance_due: total - amount_paid,
        tax
      });
    }
  }

  handleSubtotalChange = event => {
    this.setState(
      { [event.target.name]: event.target.value },
      this.calculateSubtotal()
    );
  };

  handleTotalChange = event => {
    this.setState(
      { [event.target.name]: event.target.value },
      this.calculateTotal()
    );
  };

  handleBalanceChange = event => {
    this.setState({ [event.target.name]: parseFloat(event.target.value) });
    this.setState(
      { balance_due: this.state.total - this.state.amount_paid },
      this.calculateTotal
    );
  };

  // Handle Zip Change
  handleZipChange = event => {
    this.setState(
      { [event.target.name]: event.target.value },
      this.getCityState
    );
  };

  // Get City State by Zip
  getCityState() {
    let zipcode = this.state.zipcode;
    if (zipcode.toString().length < 5) {
      this.setState({ taxRate: 0 }, this.calculateTotal);
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
          let city = "";
          let state = "";
          if (res.data.status !== "OK") {
            return;
          } else {
            res.data.results[0].address_components.map(item => {
              if (item.types[0] === "locality") {
                city = item.long_name;
              } else if (item.types[0] === "administrative_area_level_1") {
                state = item.short_name;
              } else {
                return;
              }
            });
          }
          this.setState(
            {
              city: city,
              state: state
            },
            this.calculateTotal
          );
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
    this.setState({ lineItems }, this.calculateSubtotal);
  };

  // dcha - Decrements credit when a user creates an invoice.
  decrementCredits = () => {
    axios
      .get(`/api/users/${this.mongo_id}`)
      .then(res => {
        let credits = res.data.credits;
        axios
          .put(`/api/users/${this.mongo_id}`, {
            credits: (credits -= 1)
          })
          .then(res => {
            this.props.fetchUser();
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleLogoToggle = () => {
    this.setState({ disabled: !this.state.disabled });
  };

  render() {
    // dcha - Redirects users to dashboard after invoice has been created
    if (this.state.toDashboard === true) {
      if (!this.props.subbed) {
        this.decrementCredits();
      }
      return <Redirect to="/" />;
    }

    return (
      <div>
        <div className="form-container1">
          <Form>
            {/* Add Logo */}
            <FormGroup className="logo">
              {/* <Label for="addLogo">Add Your Logo</Label> */}
              <div className="logo-toggle">
                <Input
                  type="checkbox"
                  name="logo-toggle"
                  checked={!this.state.disabled}
                  onClick={this.handleLogoToggle}
                />
                <Label for="logo-toggle" sm={2}>
                  Add a logo
                </Label>
              </div>
              <Input
                type="file"
                name="addLogo"
                id="addLogo"
                accept="image/png, image/jpeg"
                onChange={this.handleImageChange}
                disabled={this.state.disabled}
              />
              {this.edit ? (
                <FormText color="muted">
                  Browse file to change your company logo.
                </FormText>
              ) : (
                <FormText color="muted">
                  Browse file to add your company logo.
                </FormText>
              )}
            </FormGroup>
            <img ref={this.logoRef} className="logo-img" />
            {/* Invoice Header Rigth Side */}
            <FormGroup row className="invoice-number">
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
              <Label for="date" sm={2} className="date-label">
                Date
              </Label>
              <Col sm={4} className="date">
                <Input
                  value={this.state.date}
                  type="date"
                  name="date"
                  id="date"
                  placeholder="Date"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            {/* Invoice Customer Company Details */}
            <FormGroup row>
              <Label
                for="company_name"
                sm={2}
                hidden
                className="invoice-from-label"
              >
                Invoice From
              </Label>
              <Col sm={6} className="invoice-from">
                <Input
                  value={this.state.company_name}
                  type="text"
                  name="company_name"
                  id="company_name"
                  placeholder="Invoice From"
                  onChange={this.handleInputChange}
                />
              </Col>
              <Label for="due_date" sm={2} className="due-date-label">
                Due Date
              </Label>
              <Col sm={4} className="due-date">
                <Input
                  value={this.state.due_date}
                  type="date"
                  name="due_date"
                  id="due_date"
                  placeholder="Due Date"
                  onChange={this.handleInputChange}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="invoiceTo" sm={2} hidden className="invoice=to-label">
                Invoice To
              </Label>
              <Col sm={6} className="invoice-to">
                <Input
                  value={this.state.invoiceTo}
                  type="text"
                  name="invoiceTo"
                  id="invoiceTo"
                  placeholder="Invoice To"
                  onChange={this.handleInputChange}
                />
              </Col>
              <Label for="balance_due" sm={2} className="balance-due-label">
                Balance Due
              </Label>
              <Col sm={4} className="balance-due">
                <Input
                  value={accounting.formatMoney(this.state.balance_due)}
                  type="text"
                  name="balance_due"
                  id="balance_due"
                  disabled
                />
              </Col>
            </FormGroup>
            {/* Address, State, Zip */}
            <FormGroup>
              <Label for="address" hidden className="address-label">
                Address
              </Label>
              <Input
                className="address"
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
                  <Label for="zipcode" hidden className="zip-label">
                    Zip
                  </Label>
                  <Input
                    className="zip"
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
                  <Label for="city" hidden className="city-label">
                    City
                  </Label>
                  <Input
                    className="city"
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
                  <Label for="state" hidden className="state-label">
                    State
                  </Label>
                  <Input
                    className="state"
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
            <div className="table-outer-container">
              <Table striped id="line-items-table" className="striped-table">
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
                </tbody>
              </Table>
            </div> {/* table-outer-container */}
            {/* Add Line Item */}
            <div>
              <Button
                className="button-line-items"
                color="secondary"
                onClick={this.addLineItem}
              >
                Add Line Item +
              </Button>
            </div>
            <FormGroup row>
              <Label for="subtotal" sm={2}>
                Subtotal
              </Label>
              <Col sm={3}>
                <Input
                  value={accounting.formatMoney(this.state.subtotal)}
                  type="string"
                  name="subtotal"
                  id="subtotal"
                  disabled
                />
              </Col>
            </FormGroup>
            {/* Discount */}
            <FormGroup row>
              <Label for="discount" sm={2}>
                Discount
              </Label>
              <Col sm="2">
                <InputGroup>
                  <Input
                    value={this.state.discount}
                    type="number"
                    min="0"
                    max="100"
                    name="discount"
                    id="discount"
                    placeholder="0"
                    onChange={this.handleInputChange}
                  />
                  <InputGroupAddon addonType="append">%</InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="tax" sm={2}>
                Tax
              </Label>
              <Col sm="2">
                <InputGroup>
                  <Input
                    value={parseFloat((this.state.taxRate * 100).toFixed(2))}
                    type="percent"
                    name="tax"
                    id="tax"
                    placeholder="0%"
                  />
                  <InputGroupAddon addonType="append">%</InputGroupAddon>
                </InputGroup>
              </Col>
            </FormGroup>
            {/* Shipping */}
            <FormGroup row>
              <Label for="shipping" sm={2}>
                Shipping
              </Label>
              <Col sm="3">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                  <Input
                    value={this.state.shipping}
                    // value={accounting.formatMoney(this.state.shipping)}
                    type="number" 
                    min="0" 
                    max="99999" 
                    name="shipping"
                    id="shipping"
                    placeholder="0.00"
                    onChange={this.handleInputChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
            {/* Total */}
            <FormGroup row>
              <Label for="total" sm={2}>
                Total
              </Label>
              <Col sm={3}>
                <Input
                  value={accounting.formatMoney(this.state.total)}
                  type="amount"
                  name="total"
                  id="total"
                  disabled
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="amount-paid" sm={2}>
                Amount Paid:
              </Label>
              <Col sm="3">
                <InputGroup>
                  <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                  <Input
                    value={this.state.amount_paid}
                    type="number"
                    name="amount_paid"
                    id="amount_paid"
                    placeholder="$ 0.00"
                    onChange={this.handleBalanceChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
            {/* Notes & Terms*/}
            <FormGroup className="notes">
              <Label for="notes" className="notes-label">
                Notes
              </Label>
              <Input
                value={this.state.notes}
                type="text"
                name="notes"
                id="notes"
                placeholder="Add Notes Here"
                onChange={this.handleInputChange}
              />
            </FormGroup>
            <FormGroup className="terms">
              <Label for="terms" className="terms-label">
                Terms
              </Label>
              <Input
                value={this.state.terms}
                type="text"
                name="terms"
                id="terms"
                placeholder="Add Terms Here"
                onChange={this.handleInputChange}
              />
            </FormGroup>

            {this.state.errorMessages.map(error => (
              <div className="form-error">{error}</div>
            ))}

            {this.edit ? (
              <Button
                type="generate"
                className="update-button"
                onClick={this.handleUpdate}
              >
                Update Invoice
              </Button>
            ) : (
              <Button
                type="generate"
                className="save-button"
                onClick={this.handleSubmit}
              >
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
          </Form>
        </div>
      </div>
    );
  }
}

export default InvoiceForm;
