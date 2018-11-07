import React, { Component } from "react";
import { NavLink, Route } from "react-router-dom";

// import App from "../App.js";
import "./Navbar.css";

class NavBar extends Component {
  render() {
    return (
      <div className="NavBar">
        <div className="NavBar-header">
          <nav>
            <div className="top-nav">
              <NavLink classname="home" to="/" exact>
                Home
                {/* <button className="button1">Home</button> */}
              </NavLink>
              &nbsp;|&nbsp;
              <NavLink classname="invoices" to="/invoices" exact>
                Invoices
                {/* <button className="button2">Invoices</button> */}
              </NavLink>
              &nbsp;|&nbsp;
              <button className="signout-button" onClick={this.signout}>Signout</button>
            </div>
          </nav>

          <nav>
            <div classname="side-nav">
              <NavLink classname="invoices" to="/invoices" exact>
                Invoices
                {/* <button className="button2">Invoices</button> */}
              </NavLink>
              &nbsp;|&nbsp;
              <NavLink to="/billing" exact>
                Billing
                {/* <button className="button3">Billing</button> */}
              </NavLink>
              &nbsp;|&nbsp;
              <NavLink to="/settings" exact>
                Settings
                {/* <button className="button4">Settings</button> */}
              </NavLink>
              &nbsp;|&nbsp;
            </div>
          </nav>
          <main>
            <Route path="/" />
            {/* <Route path="/" component={Home} exact /> */}
            {/* <Route path="/invoices" component={Invoices} /> */}
            {/* <Route path="/billing" component={Billing} /> */}
          </main>
        </div>
      </div>
    );
  }

  signout = () => {
    localStorage.removeItem("jwt");
  };
}

export default NavBar;
