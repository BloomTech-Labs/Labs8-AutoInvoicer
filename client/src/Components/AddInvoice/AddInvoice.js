import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./AddInvoice.css";
import Navbar from "../Navbar/Navbar";
import TopNav from "../TopNav/TopNav";


class AddInvoice extends Component {
  render() {
    return (
      <div>
        <TopNav />
        <Navbar />
        <div className="newInvoice">
          <h2>Add a New Invoice</h2>
          <Link to="/new" exact>
            Add Here
          </Link>
        </div>
      </div>
    );
  }
}

export default AddInvoice;
