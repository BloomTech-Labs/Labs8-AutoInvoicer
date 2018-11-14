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
    const invoices = (await axios.get('http://localhost:8000/test/invoices')).data;
    this.setState({
      invoices,
    });
  }

  render() {
    return (
      <div className="container">
        <div className="invoices">
        Hello, Invoices
        {/* {this.state.invoices === null && <p>Loading invoices...</p>}
        {
          this.state.invoices && this.state.invoices.map(invoice => (
            <div key={invoice.id} className="">
              <Link to={`/invoices/${invoice.id}`}>
                <div className="card">
                  <div className="">
                    <h4 className="">{invoice.title}</h4>
                    <div className="">Items: {invoice.items}</div>
                    <p className="">{invoice.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))
        } */}
        </div>
      </div>
    )
  }
}
