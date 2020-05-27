import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import {
  createUser,
  loginUser,
  checkUsernameAvailable,
  checkEmailAvailability,
  uncheckAuthenticated,
  checkAuthenticated,
} from 'store/user/actions';

// global components
import { MaterialButton } from 'global/components/material/button';
import { MaterialInput } from 'global/components/material/input';

import { ReactComponent as MoleIcon } from '../../global/assets/mole-icon.svg';

import './styles.css';

const MIN_EMAIL_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 5;

class Login extends Component {
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
  }

  componentDidMount() {
    const { onCheckAuthenticated } = this.props;
    onCheckAuthenticated();
  }


  componentDidUpdate() {
    const { history } = this.props;
    const { isAuthenticated } = this.props.user;
    if (isAuthenticated && history.location.pathname === '/login') {
      history.replace('/game');
    }
  }

  componentWillUnmount() {
    const { onUncheckAuthenticated } = this.props;
    onUncheckAuthenticated();
  }

  onUpdateLoginReady() {
    const isValidEmail = (state) => state.username.length > MIN_EMAIL_LENGTH;
    const isValidPassword = (state) => state.password.length > MIN_PASSWORD_LENGTH;

    this.setState((state) => ({
      isReady: isValidEmail(state) && isValidPassword(state),
    }));
  }

  onChangeEmail({ target }) {
    const { value } = target;

    this.setState(() => ({ email: value }));

    this.onUpdateLoginReady();
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
    this.onUpdateLoginReady();
  }


  onChangeUsername({ target }) {
    const { value } = target;

    this.setState(() => ({ username: value }));

    this.onUpdateLoginReady();
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
  onClickSignup() {
    const { email, username, password } = this.state;
    const { onCreateUser } = this.props;

    onCreateUser(email, password, username);
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
    const {
      isReady,
      email,
      username,
      loading,
      emailLoading,
      usernameLoading,
      emailBlured,
      usernameBlured,
    } = this.state;

    const {
      emailAvailable,
      usernameAvailable,
    } = this.props;

    return (
      <div className="login-panel">
        <MoleIcon
          alt="Hack a mole signup"
          className="login-logo"
          style={{
            flex: 1,
            height: 84,
            width: 84,
          }}
        />
        <h1 className="login-title">
          Sign Up To Play
        </h1>
        {/** type={'email'} breaks the floaty label */}
        <MaterialInput
          label="Email"
          type="text"
          loading={emailLoading}
          error={!emailAvailable}
          valid={!emailLoading && emailAvailable && email.length > 2 && emailBlured}
          onChange={this.onChangeEmail}
          onBlur={this.onBlurEmail}
        />
        <MaterialInput
          label="Password"
          type="password"
          onChange={this.onChangePassword}
        />
        <MaterialInput
          label="Username"
          type="text"
          loading={usernameLoading}
          error={!usernameAvailable}
          valid={!usernameLoading && emailAvailable && username.length > 2 && usernameBlured}
          onChange={this.onChangeUsername}
          onBlur={this.onBlurUsername}
        />
        <MaterialButton
          buttonText="signup"
          disabled={loading || !isReady}
          loading={loading}
          onClick={this.onClickSignup}
        />
        {this.renderErrors()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user.currentUser,
  emailAvailable: state.user.emailAvailable,
  usernameAvailable: state.user.usernameAvailable,
  loading: state.user.loading,
  errors: state.user.errors,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onCreateUser: createUser,
  onLoginUser: loginUser,
  onCheckUsernameAvailable: checkUsernameAvailable,
  onCheckEmailAvailable: checkEmailAvailability,
  onCheckAuthenticated: checkAuthenticated,
  onUncheckAuthenticated: uncheckAuthenticated,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
