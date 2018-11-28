import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './Invoices.css'

export default class Invoices extends Component {
  constructor(props) {
    super(props);

    this.state = {
      invoices: null,
    };
  }

  async componentDidMount(){
    const invoices = (await axios.get('http://localhost:8000/api/invoices')).data;
    console.log(invoices)
    this.setState({
      invoices,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="invoices">
         {this.state.invoices === null && <p>Loading invoices...</p>}
        {this.state.invoices && this.state.invoices.map(invoice => (
            <div key={invoice._id} className="invoice">
              <Link to={`/invoices/${invoice._id}`}>
                  <h4>#{invoice.invoice_number}</h4>
                  <p> Date: {invoice.date}</p>
                  <p> Company: {invoice.company_name}</p>
              </Link>
            </div>
          ))
        }
        <div className="create-new-invoice">
            <p> New Invoices </p>
            <Link to="/create_invoice" exact>
              <button> + </button> 
              </Link>
          </div>
        </div>
      </div>
    )
  }
}
