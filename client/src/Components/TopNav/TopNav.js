import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import "./TopNav.css";

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.credits = this.props.credits;
    this.subbed = this.props.subbed;
  }

  findMounted() {
    const mounted = window.location.pathname.split("/")[1];
    switch (mounted) {
      case "":
        return "Invoices";
      case "invoices":
        return "Invoices";
      case "billing":
        return "Billing";
      case "create_invoice":
        return "Create Invoice";
      default:
        return null;
    }
  }

  render() {
    return (
      <div className="nav-container">
        <div className="nav-header">
          <nav>
            <div className="topNav-container">
              <NavLink className="home" to="/" exact>
                Home
              </NavLink>
              <p className="breadcrumb-spacing">></p>
              <p>
                {this.findMounted() ? (
                  <p>{this.findMounted()}</p>
                ) : (
                  <p>Invoices</p>
                )}
              </p>
            </div>
            <div className="signout-container">
              <div className="credits">
                {this.subbed ? (
                  <p>Unlimited</p>
                ) : (
                  <p>Credits: {this.credits}</p>
                )}
              </div>
              <a href={process.env.REACT_APP_LOGOUT}>Sign Out</a>
            </div>
          </nav>
        </div>
      </div>
    );
  }
}

export default TopNav;
