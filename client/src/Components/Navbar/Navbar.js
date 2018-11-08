import React, { Component } from "react";
import { NavLink, Link, Route } from "react-router-dom";

// import App from "../App.js";
import "./Navbar.css";

class NavBar extends Component {
  render() {
    return (
      <div className="NavBar">
        <div className="NavBar-header">
          <nav>
            <div className="top-nav">
              <NavLink className="home" to="/" exact>
                Home
                {/* <button className="button1">Home</button> */}
              </NavLink>
              &nbsp; > &nbsp;
              <NavLink className="invoices1" to="/invoices" exact>
                Invoices
                {/* <button className="button2">Invoices</button> */}
              </NavLink>
            </div>
            <div className="signout-container">
              <NavLink className="signout" to="/signout" exact>
                Signout
                {/* <button className="signout-button" onClick={this.signout}>Signout</button> */}
              </NavLink>
            </div>
          </nav>
            <div className="newInvoice">
              <h2 >Add a New Invoice</h2>
              <Link to="/new" exact>
                  Add Here
              </Link>
            </ div>
            <div class="side-nav">
              <NavLink className="invoices2" to="/invoices" exact>
                Invoices
                {/* <button className="button2">Invoices</button> */}
              </NavLink>
              <NavLink className="billing" to="/billing" exact>
                Billing
                {/* <button className="button3">Billing</button> */}
              </NavLink>
              <NavLink className="settings" to="/settings" exact>
                Settings
                {/* <button className="button4">Settings</button> */}
              </NavLink>
            </div>
          </div>
          <main>
            <Route path="/" exact/>
            {/* <Route path="/" component={Home} exact /> */}
            {/* <Route path="/invoices" component={Invoices} /> */}
            {/* <Route path="/billing" component={Billing} /> */}
            {/* <Route path="/new" component={NewInvoice} /> */}
          </main>
        </div>
    );
  }
  signout = () => {
    localStorage.removeItem("jwt");
  };
}

export default NavBar;
