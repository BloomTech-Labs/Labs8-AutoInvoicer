import React from "react";

import "./Settings.css";

class Settings extends React.Component {
  state = {
    email: "",
    oldPassword: "",
    newPassword: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    // TODO: axios request
  };

  render() {
    return (
      <div className="settings-wrapper">
        <form>
          <label>
            Email:
            <input name="email" type="email" onChange={this.handleChange} />
          </label>
          <label>
            Old Password:
            <input
              name="oldPassword"
              type="password"
              onChange={this.handleChange}
            />
          </label>
          <label>
            New Password:
            <input
              name="newPassword"
              type="password"
              onChange={this.handleChange}
            />
          </label>
          <button type="submit" onClick={this.handleSubmit}>
            Save
          </button>
        </form>
      </div>
    );
  }
}

export default Settings;
