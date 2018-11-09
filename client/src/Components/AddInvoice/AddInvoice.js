import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./AddInvoice.css";

class AddInvoice extends Component {
    render() {
        return (
            <div className="newInvoice">
              <h2 >Add a New Invoice</h2>
              <Link to="/new" exact>
                  Add Here
              </Link>
            </ div>
        );
    }
}

export default AddInvoice;