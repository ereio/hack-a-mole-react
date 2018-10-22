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
import { MaterialInput } from '../../global/components/material/input';

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      isReady: false,
    }

    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  componentDidUpdate() {
    const { history } = this.props;
    const { isAuthenticated } = this.props.user;

    if (isAuthenticated && history.location.pathname === '/login') {
      history.replace('/game');
    }
  }

  setLoginReady() {
    this.setState((state) => ({
      isReady: state.username.length > 2 && state.password.length > 2,
    }));  
  }

  onChangeUsername({ target }) {
    const { value } = target;

    this.setState((state) => ({
      username: value
    }))
    checkUsernameExists(value);
    this.setLoginReady();
  }

  onChangePassword({ target }) {
    const { value } = target;

    this.setState((state) => ({
      password: value
    }))
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

  renderErrors() {
    const { errors } = this.props.user;

    return errors.map((error) => {
      return (<div>{error}</div>)
    });
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
        <MaterialInput label={"Username"} type="text" onChange={this.onChangeUsername} />
        <MaterialInput label={"Password"} type="password" onChange={this.onChangePassword} />
        <MaterialButton buttonText={"Login"} disabled={!isReady} onClick={this.onClickLogin} />
        {this.renderErrors()}
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
