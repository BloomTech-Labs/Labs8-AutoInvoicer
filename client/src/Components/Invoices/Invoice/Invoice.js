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
    const invoice = (await axios.get(`http://localhost:8000/invoices/${params.invoiceId}`)).data;
    this.setState({
      invoice,
    });
  }

  render() {
    const {invoice} = this.state;
    if (invoice === null) return <p>Loading ...</p>;
    return (
      <div className="container">
        <div className="">
          <div className="">
            <h1 className="">{invoice.title}</h1>
            <p className="">{invoice.description}</p>
            <hr className="" />
            <p>Items:</p>
            {
              invoice.items.map((item, idx) => (
                <p className="" key={idx}>{item.item}</p>
              ))
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Invoice;