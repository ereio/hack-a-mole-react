import React, { Component } from 'react';

// redux 
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// react router 
import { withRouter } from 'react-router-dom';

// actions
import { createUser, loginUser, checkUsernameAvailable, uncheckAuthenticated, checkAuthenticated } from 'domain/user/actions';

//global components
import { MaterialButton } from 'global/components/material/button';
import { MaterialInput } from 'global/components/material/input';

import './styles.css';

const MIN_EMAIL_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 5;

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      isReady: false,
    }

    this.onBlurUsername = this.onBlurUsername.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
  }

  componentDidMount(){ 
    const { checkAuthenticated } = this.props;
    checkAuthenticated();
  }
  
  componentWillUnmount() {
    const { uncheckAuthenticated } = this.props;
    uncheckAuthenticated();
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
      isReady: state.username.length > MIN_EMAIL_LENGTH && state.password.length > MIN_PASSWORD_LENGTH,
    }));
  }

  onChangeUsername({ target }) {
    const { value } = target;

    this.setState((state) => ({
      username: value
    }))
    this.setLoginReady();
  }

  onBlurUsername() {
    const { username } = this.state;
    const { checkUsernameAvailable } = this.props;
    checkUsernameAvailable(username);
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

    const errorItems = errors.map((error, index) => {
      return (<div key={index} className="errors-item">{error}</div>)
    });

    return (
      <div className="error-list">
        {errorItems}
      </div>
    )
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
        <MaterialInput label={"Email"} type="email" onChange={this.onChangeUsername} onBlur={this.onBlurUsername} />
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
  checkUsernameAvailable, 
  checkAuthenticated,
  uncheckAuthenticated
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
