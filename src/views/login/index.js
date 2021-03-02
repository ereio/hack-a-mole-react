import React, { useEffect, useCallback, useState } from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';

// react router
import { useHistory } from 'react-router-dom';

// actions
import { loginUser } from '../../store/auth/actions';

// global components
import { MoleIcon } from 'global/assets';

import {
  MaterialButton, TouchableButton, MaterialInput, Panel, ErrorList
} from '../components';

import './styles.css';

export const Login = (props) => {
  // redux connections
  const history = useHistory();
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.alerts.errors);

  // init state
  const [ready, setReady] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // effects
  useEffect(() => {
    setReady(username.length > 0 && password.length > 0);
  }, [username, password]);

  // callbacks
  const onChangeUsername = useCallback(({ target }) => {
    setUsername(target.value);
  }, [setUsername]);

  const onChangePassword = useCallback(({ target }) => {
    setPassword(target.value);
  }, [setPassword]);

  const onClickLogin = () => {
    dispatch(loginUser(username, password));
  };

  const onNavigateSignup = () => {
    history.push('/signup');
  };

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
      <MaterialButton
        buttonText="login"
        disabled={!ready}
        onClick={onClickLogin} />
      <TouchableButton onClick={onNavigateSignup}>
        <div style={{ marginBottom: 16, marginTop: 24 }}>
          <span style={{ fontSize: 24 }}>New to Hack A Mole?</span>
          <span style={{ fontSize: 24, color: '#FFF800' }}> Signup</span>
        </div>
      </TouchableButton>
      <div style={{ paddingBottom: 32 }}>
        <ErrorList errors={errors} />
      </div>
    </Panel>
  );
};