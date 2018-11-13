import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./TopNav.css";
import Navbar from "../Navbar/Navbar";

class TopNav extends Component {
  render() {
    return (
      <div className="nav-container">
        <div className="nav-header">
          <nav>
            <div className="topNav-container">
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
        </div>
      </div>
    );
  }
  signout = () => {
    localStorage.removeItem("jwt");
  };
}

export default TopNav;
