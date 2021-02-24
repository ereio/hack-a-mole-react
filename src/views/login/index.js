import React, { useEffect, useCallback, useState } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect, useDispatch, useSelector } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import {
  createUser, loginUser, checkUsernameAvailable,
} from '../../store/auth/actions';

// global components
import { MoleIcon } from 'global/assets';

import { MaterialButton, TouchableButton, MaterialInput, Panel } from '../components';

import { MIN_EMAIL_LENGTH, MIN_PASSWORD_LENGTH } from 'global/constants';

import './styles.css';

const Login = (props) => {
  // redux connections
  const dispatch = useDispatch();
  const errors = useSelector(state => state.alerts.errors);

  // init state
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // effects 
  useEffect(() => {
    setReady(username.length > MIN_EMAIL_LENGTH && password.length > MIN_PASSWORD_LENGTH)
  }, [username, password])

  // callbacks
  const onChangeUsername = useCallback(({ target }) => {
    setUsername(target.value);
  }, [setUsername]);

  const onChangePassword = useCallback(({ target }) => {
    setPassword(target.value);
  }, [setPassword]);

  const onNavigateSignup = useCallback(() => {
    const { history } = props;
    history.push('/signup');
  });

  const onClickLogin = () => {
    dispatch(loginUser(username, password));
  };

  // render helpers
  const renderErrors = () => {
    const errorItems = errors.map((error) => (
      <div
        key={error}
        className="errors-item">
        {error}
      </div>
    ));

    return (
      <div className="error-list">
        {errorItems}
      </div>
    );
  }

  return (
    <Panel>
      <MoleIcon
        alt="Hack a mole login"
        className="login-logo"
        style={{
          flex: 1,
          height: 136,
          width: 136,
          paddingTop: 32,
          paddingBottom: 32,
        }} />
      <h1 className="login-title">
        Hack A Mole
    </h1>
      {/** type={'email'} breaks the floaty label */}
      <MaterialInput
        label="Email"
        type="text"
        onChange={onChangeUsername} />
      <MaterialInput
        label="Password"
        type="password"
        onChange={onChangePassword} />
      {renderErrors()}
      <MaterialButton
        buttonText="login"
        disabled={!ready}
        onClick={onClickLogin} />
      <TouchableButton onClick={onNavigateSignup}>
        <div style={{ margin: 16 }}>
          <span style={{ fontSize: 24 }}>New to hack-a-mole?</span>
          <span style={{ fontSize: 24, marginLeft: 4, color: '#FFF800' }}>Signup</span>
        </div>
      </TouchableButton>
    </Panel>
  )
}

export default withRouter(Login);
