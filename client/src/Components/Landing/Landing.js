import React, { Component } from "react";
import "./Landing.css";
import { Link } from "react-router-dom";

export default class LandingPage extends Component {
  state = {};

  render() {
    return (
      <div className="background">
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ml-auto adjust-nav-button-size">
              <a
                className="nav-item nav-link btn navigation-text signup-button-separate-color"
                href={process.env.REACT_APP_LOGIN}
              >
                Sign Up
              </a>
              <a
                className="nav-item nav-link btn navigation-text"
                href={process.env.REACT_APP_LOGIN}
              >
                Sign In
              </a>
            </div>
          </div>
        </nav>

        <header className="masthead text-white text-center">
          <div className="overlay" />
          <div className="">
            <div className="row-custom-margins">
              <div className="col-9 mx-auto mobile-spacing">
                <h1 className="mb-3 mobile-h1-text-adjustment">
                  Auto-Invoicer helps small businesses generate high-quality PDF
                  invoices and track them.
                </h1>
              </div>
              <div className="col-md-12 mx-auto button-container">
                <div className="signup-button">
                  <a
                    role="button"
                    className="btn btn-block btn-lg btn-primary navigation-text signup-button-separate-color"
                    href={process.env.REACT_APP_LOGIN}
                  >
                    Sign Up
                  </a>
                </div>
              </div>
              <div className="col-md-12 mx-auto button-container-2">
                <div className="signup-button">
                  <a
                    role="button"
                    className="btn btn-block btn-lg btn-primary navigation-text"
                    href={process.env.REACT_APP_LOGIN}
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}
