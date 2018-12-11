import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./Navbar.css";

const NavBar = props => {
    return (
      <div className="NavBar">
        <div className="NavBar-header">
          <div class="side-nav">
            <NavLink className="invoices2" to="/" exact>
              Invoices
            </NavLink>
            <NavLink className="billing" to="/billing" exact>
              Billing
            </NavLink>
            <NavLink className="create-invoice" to={props.credits <= 0 ? "/billing" : "/create_invoice"} exact>
              Create New Invoice
            </NavLink>
          </div>
        </div>
      </div>
    );
}

export default NavBar;
