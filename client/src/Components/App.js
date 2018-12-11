import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";

// Import pages
import LandingPage from "./Landing/Landing";
import Settings from "./Settings/Settings";
import Invoices from "./Invoices/Invoices";
import Invoice from "./Invoices/Invoice/Invoice";
import InvoiceForm from "./InvoiceForm/InvoiceForm";
import NavBar from "./Navbar/Navbar";
import TopNav from "./TopNav/TopNav";
import Billing from "./Billing/Billing";

import AddInvoice from "./AddInvoice/AddInvoice";
import PrintPdf from "./PrintPdf/PrintPdf";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      routes: (
        <Route key={this.routeKey()} exact path="/" component={LandingPage} />
      )
    };
  }

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
    console.log("component did update");
    // console.log(this.state.routes);
    // console.log(this.state.user);

    if (this.state.user && !this.state.user.error) {
      let routes = [
        <div className="top-nav-app-container">
          <Route
            key={this.routeKey()}
            path="/"
            render={props => (
              <TopNav
                credits={this.state.user.credits}
                subbed={this.state.user.subscribed_member}
              />
            )}
          />
          <div className="app-container">
            <Route key={this.routeKey()} path="/" render={props => (
              <NavBar
                credits={this.state.user.credits}
              />
            )} />
            <Route
              key={this.routeKey()}
              path="/billing"
              render={props => (
                <Billing user={this.state.user} fetchUser={this.fetchUser} />
              )}
            />
            <Route
              key={this.routeKey()}
              path="/settings"
              component={Settings}
            />
            <Route
              key={this.routeKey()}
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
              key={this.routeKey()}
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
              key={this.routeKey()}
              path="/invoices/:id"
              render={props => (
                <InvoiceForm
                  auth0_userID={this.state.user.auth0_userID}
                  invoice_num={this.state.user.invoice_num}
                  mongo_id={this.state.user._id}
                  path={props.match.path}
                  params={props.match.params}
                  subbed={this.state.user.subscribed_member}
                />
              )}
            />
            <Route
              key={this.routeKey()}
              path="/empty_invoice"
              component={AddInvoice}
            />
            <Route
              key={this.routeKey()}
              path="/pdf_invoice"
              component={PrintPdf}
            />
          </div>
        </div>
      ];
      this.setState({ routes });
    }
  }

  routeKey() {
    return Math.floor(Math.random() * Math.floor(999999));
  }

  render() {
    // for testing, we're logging the state.user to our console to see when we're logged in, this.state.user has the information from mongooose
    // when we're logged out, this is null, so we'll only ever have this.state.user populated when the user's logged in
    // console.log(this.state.user);
    return (
      <Router>
        <div className="App">
          {!this.state.routes ? (
            <p>loading</p>
          ) : (
            <React.Fragment>{this.state.routes}</React.Fragment>
          )}
        </div>
      </Router>
    );
  }
}

export default App;
