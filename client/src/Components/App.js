import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import pages
import LandingPage from "./Landing/Landing";
import SignUp from "./SignUp/SignUp";
import Settings from "./Settings/Settings";

import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          {/* <h1>Hello, world!</h1>
          <h1>Auto-Invoicer</h1> */}
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/register" component={SignUp} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
