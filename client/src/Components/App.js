import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";

// Import pages
import LandingPage from "./Landing/Landing";
import Settings from "./Settings/Settings";
import Invoices from "./Invoices/Invoices";
import InvoiceForm from "./InvoiceForm/InvoiceForm";
import NavBar from "./Navbar/Navbar";
import TopNav from "./TopNav/TopNav";
import Billing from "./Billing/Billing";

import AddInvoice from "./AddInvoice/AddInvoice";
import PrintPdf from "./PrintPdf/PrintPdf"
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      routes: <Route key={this.routeKey()} exact path="/" component={LandingPage} />
    };
  }

  componentDidMount() {
    //this gets the user info to be used on the client
    console.log("component mounted");
    axios
      .get("http://localhost:8000/react_user_info")
      .then(res => {
        console.log("axios success");
        const user = res.data;
        console.log(user);
        this.setState({user}, this.setRoutes);
      })
      .catch(err => {
        console.log("axios fails");
        console.log(err, "error");
      });
  }

  setRoutes() {
    console.log("component did update");
    // console.log(this.state.routes);
    // console.log(this.state.user);

    if (this.state.user && !this.state.user.error) {
      let routes = [
        <Route key={this.routeKey()} path="/" component={TopNav} />,
        <Route key={this.routeKey()} path="/" component={NavBar} />,
        <Route key={this.routeKey()} path="/billing" render={(props) => <Billing user={this.state.user} />} />,
        <Route key={this.routeKey()} path="/settings" component={Settings} />,
        <Route
          key={this.routeKey()}
          path="/create_invoice"
          component={InvoiceForm}
        />,
        <Route key={this.routeKey()} path="/" component={Invoices} />,
        <Route key={this.routeKey()} path="/invoices" component={Invoices} />,
        <Route key={this.routeKey()} path="/empty_invoice" component={AddInvoice} />,
        // This should be re-written to display the eventual finished PDF or invoice form that's been filled out;
        // Right now, it's directing to the New Invoice Form, which is already covered by
        // path="/create_invoice" - Mark Hong
        // <Route
        //   key={this.routeKey()}
        //   path="/invoices/:id"
        //   component={InvoiceForm}
        // />
        <Route key={this.routeKey()} path="/pdf_invoice" component={PrintPdf} />,
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