import React, { Component } from "react";
import jsPDF from "jspdf";

import { Button, ListGroup, ListGroupItem } from "reactstrap";

class PrintPdf extends Component {
  state = {
    invoice_number: 123789,
    date: "11/16/2018",
    due_date: "12/30/2018",
    balance_due: 100.00,
    company_name: "Corner Bakery",
    invoiceTo: "Mary Newman",
    address: "Apt 7 Apple Tree Building",
    zipcode: 10013,
    city: "New York",
    state: "NY",
    item: "3 Layered Cake",
    quantity: 1,
    rate: 100.00,
    amount: 100.00,
    subtotal: 100.00,
    discount: 0.0,
    tax: 0.0,
    shipping: 0.0,
    total: 100.0,
    amount_paid: 100.00,
    notes: "Pick up on Tuesday",
    terms: "Paid in cash."
  };

  handleSubmit = event => {
    event.preventDefault();

    const pdf = new jsPDF({
      unit: "in",
      format: [8, 11]
    });
    pdf.text(`Invoice Number: ${this.state.invoice_number}`, 0.5, 0.8);
    pdf.text(`Date: ${this.state.date}`, 0.5, 1.1);
    pdf.text(`PDF Filename: ${this.state.invoiceTo}`, 0.5, 1.5);
    pdf.text(`Due Date: ${this.state.due_date}`, 0.5, 1.8);
    pdf.text(`Balance Due: ${this.state.balance_due}`, 0.5, 2.1);
    pdf.text(`Company Name: ${this.state.company_name}`, 0.5, 2.4);
    pdf.text(`Invoice To: ${this.state.invoiceTo}`, 0.5, 2.7);
  
    pdf.save(`${this.state.invoiceTo}`);
  };

  render() {
    return (
      <div  clasdName="pdf_invoice">
        <h2>Labs8 Auto-Invoicer</h2>
        <ListGroup>
          <ListGroupItem>Invoice Number: 123789 </ListGroupItem>
          <ListGroupItem>Date: 11/16/2018</ListGroupItem>
          <ListGroupItem>Due Date: 12/30/2018</ListGroupItem>
          <ListGroupItem>Balance Due: $100.0</ListGroupItem>
          <ListGroupItem>Company Name: Corner Bakery</ListGroupItem>
          <ListGroupItem>Invoice To: Mary Newman</ListGroupItem> 
        </ListGroup>
        <Button onClick={this.handleSubmit} color="secondary">Download PDF</Button>{" "}
      </div>
    );
  }
}

export default PrintPdf;
