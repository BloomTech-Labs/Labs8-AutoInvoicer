import React, {Component} from 'react';
import axios from 'axios';

class Invoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoice: null,
    };
  }

  async componentDidMount() {
    const { match: { params } } = this.props;
    const invoice = (await axios.get(`http://localhost:8000/api/invoices/${params.id}`)).data;
    console.log(invoice);
    this.setState({
      invoice,
    });
  }

  render() {
    const {invoice} = this.state;
    if (this.state.invoice === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="">
          <div className="">
            <h1 className="">From: {invoice.company_name}</h1>
            <p className="">Date:{invoice.date}</p> 
            <p className="">Due Date: {invoice.due_date}</p>
            <p className="">Item: {invoice.item}</p>
          </div>
        </div>
      </div>
    )
  }
}

export default Invoice;