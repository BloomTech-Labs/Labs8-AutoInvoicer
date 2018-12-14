import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

// Import pages
import LandingPage from "./Landing/Landing";
import Invoices from "./Invoices/Invoices";
import InvoiceForm from "./InvoiceForm/InvoiceForm";
import NavBar from "./Navbar/Navbar";
import TopNav from "./TopNav/TopNav";
import Billing from "./Billing/Billing";

import "./App.css";

class App extends Component {
  state = {
    user: null,
    routes: <Route exact path="/" component={LandingPage} />
  };

  componentDidMount() {
    //this gets the user info to be used on the client
    this.fetchUser();
  }

  // should be used by child components that need to update user information after performing an operation
  fetchUser = () => {
    axios
      .get(process.env.REACT_APP_VERIFY_USER)
      .then(res => {
        const user = res.data;
        this.setState({ user }, this.setRoutes);
      })
      .catch(err => {
        console.log(err);
      });
  };

  setRoutes() {
    if (this.state.user && !this.state.user.error) {
      let routes = (
        <div className="top-nav-app-container">
          <Route
            path="/"
            render={props => (
              <TopNav
                credits={this.state.user.credits}
                subbed={this.state.user.subscribed_member}
              />
            )}
          />
          <div className="app-container">
            <Route
              path="/"
              render={props => (
                <NavBar
                  subbed={this.state.user.subscribed_member}
                  credits={this.state.user.credits}
                />
              )}
            />
            <Route
              exact
              path="/"
              render={props => (
                <Invoices
                  credits={this.state.user.credits}
                  subbed={this.state.user.subscribed_member}
                />
              )}
            />
            <Route
              path="/billing"
              render={props => (
                <Billing user={this.state.user} fetchUser={this.fetchUser} />
              )}
            />
            <Route
              path="/create_invoice"
              render={props => (
                <InvoiceForm
                  auth0_userID={this.state.user.auth0_userID}
                  invoice_num={this.state.user.invoice_num}
                  mongo_id={this.state.user._id}
                  path={props.match.path}
                  params={props.match.params}
                  fetchUser={this.fetchUser}
                  subbed={this.state.user.subscribed_member}
                />
              )}
            />
            <Route
              path="/invoices/:id"
              render={props => (
                <InvoiceForm
                  auth0_userID={this.state.user.auth0_userID}
                  invoice_num={this.state.user.invoice_num}
                  mongo_id={this.state.user._id}
                  path={props.match.path}
                  params={props.match.params}
                  subbed={this.state.user.subscribed_member}
                  fetchUser={this.fetchUser}
                />
              )}
            />
          </div>
        </div>
      );
      this.setState({ routes });
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          {!this.state.routes ? (
            <p>loading</p>
          ) : (
            <Fragment>{this.state.routes}</Fragment>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
