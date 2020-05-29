import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import {
  createUser, loginUser, checkUsernameAvailable,
} from 'store/auth/actions';

// global components
import { MaterialButton } from 'global/components/material/button';
import { MaterialInput } from 'global/components/material/input';

import { ReactComponent as MoleIcon } from '../../global/assets/mole-icon.svg';

import './styles.css';
import { TouchableButton } from '../../global/components/material/touchable';

const MIN_EMAIL_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 5;

class Login extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      isReady: false,
    };

    this.onClickLogin = this.onClickLogin.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onNavigateToSignup = this.onNavigateToSignup.bind(this);
  }

  // componentDidUpdate() {
  //   const { history } = this.props;
  //   const { authenticated } = this.props;
  //   if (authenticated && history.location.pathname === '/login') {
  //     history.replace('/game');
  //   }
  // }

  onUpdateLoginReady() {
    const isValidEmail = (state) => state.username.length > MIN_EMAIL_LENGTH;
    const isValidPassword = (state) => state.password.length > MIN_PASSWORD_LENGTH;

    this.setState((state) => ({
      isReady: isValidEmail(state) && isValidPassword(state),
    }));
  }

  onChangeUsername({ target }) {
    const { value } = target;

    this.setState(() => ({
      username: value,
    }));

    this.onUpdateLoginReady();
  }

  onNavigateToSignup() {
    const { history } = this.props;
    history.replace('/signup');
  }


  onChangePassword({ target }) {
    const { value } = target;

    this.setState(() => ({ password: value }));
    this.onUpdateLoginReady();
  }

  /**
   * onClickLogin
   *
   * the isNameAvailable value actually dictates if the user is logging in or
   * creating a new user
   */
  onClickLogin() {
    const { username, password } = this.state;
    const { onLoginUser } = this.props;

    onLoginUser(username, password);
  }

  renderErrors() {
    const { errors } = this.props;

    const errorItems = errors.map((error) => (
      <div key={error} className="errors-item">{error}</div>
    ));

    return (
      <div className="error-list">
        {errorItems}
      </div>
    );
  }

  render() {
    const { isReady } = this.state;

    return (
      <div className="login-panel">
        <MoleIcon
          alt="Hack a mole login"
          className="login-logo"
          style={{
            flex: 1,
            height: 84,
            width: 84,
          }}
        />
        <h1 className="login-title">
          Hack A Mole
        </h1>
        {/** type={'email'} breaks the floaty label */}
        <MaterialInput label="Email" type="text" onChange={this.onChangeUsername} />
        <MaterialInput label="Password" type="password" onChange={this.onChangePassword} />
        {this.renderErrors()}
        <MaterialButton buttonText="login" disabled={!isReady} onClick={this.onClickLogin} />
        <TouchableButton onClick={this.onNavigateToSignup}>
          <div style={{ margin: 16 }}>
            <span style={{ fontSize: 16 }}>New to hack-a-mole?</span>
            <span style={{ fontSize: 16, marginLeft: 4, color: '#FFF800' }}>Signup</span>
          </div>
        </TouchableButton>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.alerts.errors,
  authenticated: state.auth.authenticated,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onCreateUser: createUser,
  onLoginUser: loginUser,

  onCheckUsernameAvailable: checkUsernameAvailable,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
