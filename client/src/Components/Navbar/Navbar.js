import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./Navbar.css";
import AddInvoice from "../AddInvoice/AddInvoice";

class Navbar extends Component {
  render() {
    return (
      <div className="NavBar">
        <div className="NavBar-header">
          <nav>
            <div className="top-nav">
              <NavLink className="home" to="/" exact>
                Home
              </NavLink>
              &nbsp; > &nbsp;
              <NavLink className="invoices1" to="/invoices" exact>
                Invoices
              </NavLink>
            </div>
            <div className="signout-container">
              <NavLink className="signout" to="/signout" exact>
                Signout
              </NavLink>
            </div>
          </nav>
            <div>
              <AddInvoice />
            </div>
            <div class="side-nav">
              <NavLink className="invoices2" to="/invoices" exact>
                Invoices
              </NavLink>
              <NavLink className="billing" to="/billing" exact>
                Billing
              </NavLink>
              <NavLink className="settings" to="/settings" exact>
                Settings
              </NavLink>
            </div>
          </div>
        </div>
    );
  }
  signout = () => {
    localStorage.removeItem("jwt");
  };
}

export default Navbar;
