import React, { Component } from 'react';

// redux 
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// react router 
import { withRouter } from 'react-router-dom';

// actions
import { createUser, loginUser, checkUsernameExists } from 'domain/user/actions';

//global components
import { MaterialButton } from 'global/components/material/button';

import './styles.css';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      isReady: false,
    }

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  componentDidUpdate(){
    const {history} = this.props;
    const {isAuthenticated} = this.props.user;
 
    if(isAuthenticated && history.location.pathname === "/login"){ 
      history.push( '/game' );
    } 
  }

  setLoginReady() {
    const { username, password } = this.state;
    const { isNameAvailable } = this.props.user;

    this.setState((state) => ({
      isReady: username.length > 2 && password.length > 2,
    }))

  } 
 
  onChangeUsername() {
    const { checkUsernameExists } = this.props;
    const { username } = this.state;
    checkUsernameExists(username);
    this.setLoginReady();
  }

  onChangePassword() {
    this.setLoginReady();
  }

  /**
   * onClickLogin
   * 
   * the isNameAvailable value actually dictates if the user is logging in or
   * creating a new user
   */
  onClickLogin() {
    const { username, password } = this.state;
    const { createUser, loginUser } = this.props;
    const { isNameAvailable } = this.props.user;

    if (isNameAvailable) {
      createUser(username, password);
    } else {
      loginUser(username, password);
    }
  }

  render() {
    const { isReady } = this.state;
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
        <MaterialButton buttonText={"Login"} disabled={isReady} onClick={this.onClickLogin} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = dispatch => bindActionCreators({
  createUser,
  loginUser,
  checkUsernameExists
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
