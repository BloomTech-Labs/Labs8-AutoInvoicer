import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./Navbar.css";

class Navbar extends Component {
  render() {
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
