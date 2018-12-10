import React, { Component } from "react";
import "./Landing.css";
import { Link } from "react-router-dom";

export default class LandingPage extends Component {
  state = {};

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ml-auto">
              <a
                className="nav-item nav-link btn"
                href={process.env.REACT_APP_LOGIN}
              >
                Sign In
              </a>
              <a
                className="nav-item nav-link btn"
                href={process.env.REACT_APP_LOGIN}
              >
                Sign Up
              </a>
            </div>
          </div>
        </nav>

        <header className="masthead text-white text-center">
          <div className="overlay" />
          <div className="">
            <div className="row-custom-margins">
              <div className="col-xl-9 mx-auto">
                <h1 className="mb-5">
                  Auto-Invoicer helps small businesses generate high-quality PDF
                  invoices and track them.
                </h1>
              </div>
              <div className="col-md-10 col-lg-8 col-xl-7 ml-auto">
                <div className="col-3 text-center">
                  <a
                    role="button"
                    className="btn btn-block btn-lg btn-primary"
                    href={process.env.REACT_APP_LOGIN}
                  >
                    Sign up!
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
