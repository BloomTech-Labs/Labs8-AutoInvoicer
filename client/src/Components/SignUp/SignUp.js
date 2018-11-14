import React from "react";
import axios from "axios";

import "./SignUp.css";
import { userInfo } from "os";

export default class SignUp extends React.Component {
  state = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    passwordMatch: true
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = { ...this.state };
    const user = {
      name,
      email,
      password
    };
    if (user.password !== confirmPassword) {
      this.setState({ passwordMatch: false })
      return;
    } else {
      console.log(user)
      axios
        .post("http://localhost:8000/api/register", user)
        .then(res => {
          this.setState({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            passwordMatch: true
          });
        })
        .catch(err => {
          // TODO: add error handling
          console.log(err);
        });
    }
  };

  render() {
    return (
      <div className="signup-wrapper">
        <h1>Register</h1>
        <form>
          <label>
            Username:
            <input
              value={this.state.name}
              name="name"
              type="text"
              onChange={this.handleChange}
            />
          </label>
          <label>
            Email:
            <input
              value={this.state.email}
              name="email"
              type="email"
              onChange={this.handleChange}
            />
          </label>
          <label>
            Password:
            <input
              value={this.state.password}
              name="password"
              type="password"
              onChange={this.handleChange}
            />
          </label>
          <label>
            Confirm Password:
            <input
              value={this.state.confirmPassword}
              name="confirmPassword"
              type="password"
              onChange={this.handleChange}
            />
          </label>
          {this.state.passwordMatch ? (
            <React.Fragment />
          ) : (
            <p>Passwords don't match!</p>
          )}
          <button type="submit" onClick={this.handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}
