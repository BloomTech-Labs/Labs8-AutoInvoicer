import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import pages
import LandingPage from "./Landing/Landing";
import Settings from "./Settings/Settings";
import Invoices from "./Invoices/Invoices";
import InvoiceForm from "./InvoiceForm/InvoiceForm";
import NavBar from "./Navbar/Navbar";
import TopNav from "./TopNav/TopNav";
import Billing from "./Billing/Billing";

import "./App.css";

class App extends Component {
  state = {
    routes: null
  };

  componentDidMount() {
    // TODO: check for valid session
    const token = localStorage.getItem("token");
    if (!token) {
      const routes = [
        <Route key={this.routeKey()} exact path="/" component={LandingPage} />
      ];
      this.setState({ routes });
    } else {
      const routes = [
        <Route key={this.routeKey()} path="/" component={TopNav} />,
        <Route key={this.routeKey()} path="/" component={NavBar} />,
        <Route key={this.routeKey()} path="/billing" component={Billing} />,
        <Route key={this.routeKey()} path="/settings" component={Settings} />,
        <Route
          key={this.routeKey()}
          path="/create_invoice"
          component={InvoiceForm}
        />,
        <Route key={this.routeKey()} path="/invoices" component={Invoices} />,
        <Route
          key={this.routeKey()}
          path="/invoices/:id"
          component={InvoiceForm}
        />
      ];
      this.setState({ routes });
    }
  }

  routeKey() {
    return Math.floor(Math.random() * Math.floor(999999));
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            {!this.state.routes ? (
              <p>loading</p>
            ) : (
              <React.Fragment>{this.state.routes}</React.Fragment>
            )}
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
