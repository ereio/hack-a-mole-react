import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import {
  createUser, loginUser, checkUsernameAvailable, uncheckAuthenticated, checkAuthenticated,
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
      isReady: false,
    };

    this.onBlurUsername = this.onBlurUsername.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onClickLogin = this.onClickLogin.bind(this);
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

  onChangeUsername({ target }) {
    const { value } = target;

    this.setState(() => ({
      username: value,
    }));

    this.onUpdateLoginReady();
  }

  onBlurUsername() {
    const { username } = this.state;
    const { onCheckUsernameAvailable } = this.props;
    onCheckUsernameAvailable(username);
  }

  onChangePassword({ target }) {
    const { value } = target;

    this.setState((state) => ({
      password: value,
    }));
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
    const { onCreateUser, onLoginUser } = this.props;
    const { isNameAvailable } = this.props.user;

    if (isNameAvailable) {
      onCreateUser(username, password);
    } else {
      onLoginUser(username, password);
    }
  }

  renderErrors() {
    const { errors } = this.props.user;

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
        <MaterialInput label="Email" type="text" onChange={this.onChangeUsername} onBlur={this.onBlurUsername} />
        <MaterialInput label="Password" type="password" onChange={this.onChangePassword} />
        <MaterialButton buttonText="login" disabled={!isReady} onClick={this.onClickLogin} />
        {this.renderErrors()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.user });

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onCreateUser: createUser,
  onLoginUser: loginUser,
  onCheckUsernameAvailable: checkUsernameAvailable,
  onCheckAuthenticated: checkAuthenticated,
  onUncheckAuthenticated: uncheckAuthenticated,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
