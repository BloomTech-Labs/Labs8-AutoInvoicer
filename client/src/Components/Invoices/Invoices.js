import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Invoices.css";
import accounting from "accounting";
import AddInvoice from "./AddInvoice/AddInvoice";
import moment from "moment";

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

  addInvoice = () => {
    // pulls in subbed prop from app to check if tru since subbed is tied to unlimited.
    if (this.props.credits > 0 || this.props.subbed) {
      return <AddInvoice />;
    } else {
      return (
        <div className="create-new-invoice">
          <p> Please Add Credits </p>
          <Link to="/billing" exact>
            <button> + </button>
          </Link>
        </div>
      );
    }
  };

  invoicePaymentStatus = (invoice) => {
    //condition for unpaid
    if((invoice.balance_due == invoice.total && invoice.total > 0) || invoice.amount_paid == 0) {
      return "unpaid";
    } 
    //condition for partial payment
    else if (invoice.balance_due < invoice.total && invoice.balance_due !== 0) {
      return "partially-paid";
    } 
    // full payment
    else {
      return "paid";
    }
  }

  render() {
    return (
      <div className="container">
        <div className="invoices">
          {this.state.invoices === null && <p>Loading invoices...</p>}
          {this.state.invoices &&
            this.state.invoices.map(invoice => (
              <div key={invoice._id} className="invoice">
                <div className="status-circle-container">
                  <div
                    className={this.invoicePaymentStatus(invoice) + " status-circle"}
                  />
                </div>
                <Link to={`/invoices/${invoice._id}`}>
                  <h4>Invoice #{invoice.invoice_number}</h4>
                  <p>
                    {" "}
                    Due Date:{" "}
                    {invoice.due_date
                      ? moment(invoice.due_date)
                          .add(1, "d")
                          .format("MMM Do YYYY")
                      : ""}
                  </p>
                  <p> Company: {invoice.company_name}</p>
                  <p>
                    {invoice.balance_due === 0
                      ? "Status: Payment Complete"
                      : `Remaining Balance: ${accounting.formatMoney(
                          invoice.balance_due
                        )}`}
                  </p>
                  <p className="late">
                    {invoice.due_date < Date.now() && invoice.balance_due > 0
                      ? "Status: Overdue"
                      : ""}
                  </p>
                </Link>
              </div>
            ))}
          {this.addInvoice()}
        </div>
      </div>
    );
  }
}
