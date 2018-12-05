import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './Invoices.css'
import accounting from 'accounting';

export default class Invoices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: null
    };
  }

  async componentDidMount() {
    const invoices = (await axios.get(process.env.REACT_APP_NEW_INVOICE)).data;
    this.setState({
      invoices
    });
  }

  render() {
    return (
      <div className="container">
        <div className="invoices">
          {this.state.invoices === null && <p>Loading invoices...</p>}
          {this.state.invoices &&
            this.state.invoices.map(invoice => (
              <div
                key={invoice._id}
                className={
                  invoice.balance_due === 0
                    ? "invoice paid"
                    : "invoice unpaid"
                }
              >
                <Link to={`/invoices/${invoice._id}`}>
                  <h4>Invoice #{invoice.invoice_number}</h4>
                  <p> Due Date: {invoice.due_date}</p>
                  <p> Company: {invoice.company_name}</p>
                  <p>
                    {" "}
                    {invoice.balance_due === 0
                      ? "Status: Payment Complete"
                      : `Remaining Balance: $${accounting.formatMoney(invoice.balance_due)}`}{" "}
                  </p>
                  <p className="late">
                    {" "}
                    {invoice.due_date < Date.now() &&
                    invoice.balance_due > 0
                      ? "Status: Overdue"
                      : ""}
                  </p>
                </Link>
              </div>
            ))}
          <div className="create-new-invoice">
            <p> New Invoices </p>
            <Link to="/create_invoice" exact>
              <button> + </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}
