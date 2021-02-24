import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import {
  createUser,
  checkUsernameAvailable,
  checkEmailAvailability,
} from '../../store/auth/actions';

import { resetAlerts } from '../../store/alerts/actions';

// global components
import { TouchableButton, MaterialInput, MaterialButton } from '../components';
import { MoleIcon } from '../../global/assets';

import './styles.css';

const MIN_PASSWORD_LENGTH = 5;

class Signup extends Component {
  constructor() {
    super();

    this.state = {
      username: '',
      password: '',
      email: '',
      isReady: false,
      loading: false,
      emailBlured: false,
      usernameBlured: false,
      emailLoading: false,
      usernameLoading: false,
    };

    this.onBlurEmail = this.onBlurEmail.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);


    this.onBlurUsername = this.onBlurUsername.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickSignup = this.onClickSignup.bind(this);
    this.onNavigateToLogin = this.onNavigateToLogin.bind(this);
  }

  componentDidMount() {
    const { onResetAlerts } = this.props;
    onResetAlerts();
  }

  onUpdateSignupReady() {
    const isValidPassword = (state) => state.password.length > MIN_PASSWORD_LENGTH;
    const { emailAvailable, usernameAvailable } = this.props;

    this.setState((state) => ({
      isReady: isValidPassword(state)
        && emailAvailable
        && usernameAvailable,
    }));
  }

  onChangeEmail({ target }) {
    const { value } = target;

    this.setState(() => ({ email: value }));

    this.onUpdateSignupReady();
  }

  async onBlurEmail() {
    const { email } = this.state;
    const { onCheckEmailAvailable } = this.props;

    this.setState(() => ({ emailLoading: true }));
    await onCheckEmailAvailable(email);

    this.setState(() => ({
      emailBlured: true,
      emailLoading: false,
    }));
    this.onUpdateSignupReady();
  }


  onChangeUsername({ target }) {
    const { value } = target;

    this.setState(() => ({ username: value }));

    this.onUpdateSignupReady();
  }

  async onBlurUsername() {
    const { username } = this.state;
    const { onCheckUsernameAvailable } = this.props;
    this.setState(() => ({ usernameLoading: true }));
    await onCheckUsernameAvailable(username);
    this.setState(() => ({
      usernameLoading: false,
      usernameBlured: true,
    }));
    this.onUpdateSignupReady();
  }

  onChangePassword({ target }) {
    const { value } = target;

    this.setState(() => ({ password: value }));
    this.onUpdateSignupReady();
  }

  /**
   * onClickSignup
   *
   * the isNameAvailable value actually dictates if the user is logging in or
   * creating a new user
   */
  async onClickSignup() {
    const { email, username, password } = this.state;
    const { onCreateUser } = this.props;

    const created = await onCreateUser({ email, password, username });
    const { history } = this.props;
    if (created) {
      history.replace('/login');
    }
  }

  async onNavigateToLogin() {
    const { history } = this.props;
    history.push('/login');
  }

  renderErrors() {
    const { errors } = this.props;

    const errorItems = errors.map((error) => (
      <div
        key={error}
        className="errors-item">{error}</div>
    ));

    return (
      <div className="error-list">
        {errorItems}
      </div>
    );
  }

  render() {
    const {
      isReady,
      loading,
      password,
      emailLoading,
      usernameLoading,
      emailBlured,
      usernameBlured,
    } = this.state;

    const {
      emailAvailable = true,
      usernameAvailable = true,
    } = this.props;

    const passwordValid = password.length > MIN_PASSWORD_LENGTH;

    return (
      <div className="login-panel">
        <MoleIcon
          alt="Hack a mole signup"
          className="login-logo"
          style={{
            flex: 1,
            height: 84,
            width: 84,
          }} />
        <h1 className="login-title">
          Sign Up To Play
        </h1>
        {/** type={'email'} breaks the floaty label */}
        <MaterialInput
          label="Email"
          type="text"
          loading={emailLoading}
          error={!emailAvailable && !emailLoading}
          valid={!emailLoading && emailAvailable && emailBlured}
          onChange={this.onChangeEmail}
          onBlur={this.onBlurEmail} />
        <MaterialInput
          label="Password"
          type="password"
          valid={passwordValid}
          error={!passwordValid && password}
          onChange={this.onChangePassword} />
        <MaterialInput
          label="Username"
          type="text"
          loading={usernameLoading}
          error={!usernameAvailable && !emailLoading}
          valid={!usernameLoading && usernameAvailable && usernameBlured}
          onChange={this.onChangeUsername}
          onBlur={this.onBlurUsername} />
        <MaterialButton
          buttonText="signup"
          disabled={loading || !isReady}
          loading={loading}
          onClick={this.onClickSignup} />
        <TouchableButton onClick={this.onNavigateToLogin}>
          <div style={{ marginTop: 16 }}>
            <span style={{ fontSize: 16 }}>Already have an account?</span>
            <span style={{ fontSize: 16, marginLeft: 4, color: '#FFF800' }}>Login</span>
          </div>
        </TouchableButton>
        {this.renderErrors()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.alerts.errors,
  loading: state.auth.loading,
  authenticated: state.auth.authenticated,
  emailAvailable: state.auth.emailAvailable,
  usernameAvailable: state.auth.usernameAvailable,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onCreateUser: createUser,
  onResetAlerts: resetAlerts,
  onCheckUsernameAvailable: checkUsernameAvailable,
  onCheckEmailAvailable: checkEmailAvailability,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));
