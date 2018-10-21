import React, { Component } from 'react';

//global components
import { MaterialButton } from 'global/components/material/button';

import './styles.css';

class Login extends Component {
  constructor() {
    super();

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  onChangeUsername() {

  }

  onChangePassword() {

  }

  onClickLogin() {

  }

  render() {
    return (
      <div className="login-panel">
        <img
          alt="Hack a mole login"
          className="login-logo"
          src="images/primary-logo.png"
          height="84"
          width="84" />
        <h1 className="login-title">Hack A Mole</h1>
        <div className="login-field-container">
          <input className="login-field" type="text" required="required" onChange={this.onChangeUsername} />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label className="login-field-label">Username</label>
        </div>
        <div className="login-field-container">
          <input className="login-field" type="password" required="required" onChange={this.onChangePassword} />
          <span className="highlight"></span>
          <span className="bar"></span>
          <label className="login-field-label">Password</label>
        </div>
        <MaterialButton buttonText={"Login"} onClick={this.onClickLogin} />
      </div>
    );
  }
}

export default Login;
