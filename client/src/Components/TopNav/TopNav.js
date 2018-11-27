import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";

import "./TopNav.css";

class TopNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credits: this.props.credits,
      subbed: this.props.subbed
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        credits: this.props.credits,
        subbed: this.props.subbed
      })
    }
  }

  findMounted() {
    const mounted = window.location.pathname.split('/')[1];
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
    console.log(this.findMounted());
    return (
      <div className="nav-container">
        <div className="nav-header">
          <nav>
            <div className="topNav-container">
              <NavLink className="home" to="/" exact>
                Home
              </NavLink>
              <p>></p>
              <p>{this.findMounted() ? (
                <p>{this.findMounted()}</p>
              ) : (
                <p>Invoices</p>
              )}</p>
            </div>
            <div>
              {this.state.subbed ? (
                <p>Unlimited</p>
              ) : (
                <p>Credits: {this.state.credits}</p>
              )}
            </div>
            <div className="signout-container">
              <a href={process.env.REACT_APP_LOGOUT}>Sign Out</a>
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
