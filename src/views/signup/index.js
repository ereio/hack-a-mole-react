import React, { useCallback, useEffect, useMemo, useState } from 'react';

// redux 
import { useDispatch, useSelector } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';
import { MoleIcon } from 'global/assets';
import { MIN_PASSWORD_LENGTH } from 'global/constants';

// actions
import {
  createUser,
  checkUsernameAvailable,
  checkEmailAvailability,
} from '../../store/auth/actions';

import { resetAlerts } from '../../store/alerts/actions';

// global components
import { Panel, TouchableButton, MaterialInput, MaterialButton } from '../components';

import './styles.css';
const Signup = (props) => {
  const dispatch = useDispatch();

  const errors = useSelector(state => state.alerts.errors);
  const availableEmail = useSelector(state => state.auth.emailAvailable);
  const availableUsername = useSelector(state => state.auth.usernameAvailable);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [ready, setReady] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [blurredEmail, setBlurredEmail] = useState(false);
  const [blurredUsername, setBlurredUsername] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingUsername, setLoadingUsername] = useState(false);

  const passwordValid = useMemo(
    () => password.length > MIN_PASSWORD_LENGTH,
    [password]
  );

  // effects
  useEffect(() => {
    dispatch(resetAlerts());
  }, [])

  useEffect(() => {
    const validPassword = password > MIN_PASSWORD_LENGTH;
    setReady(validPassword && availableEmail && availableUsername)
  }, [availableEmail, availableUsername, password])

  // callbacks
  const onChangeEmail = useCallback(({ target: { value } }) => {
    setEmail(value);
  }, [setEmail]);

  const onChangeUsername = useCallback(({ target: { value } }) => {
    setUsername(value);
  }, [setEmail]);

  const onChangePassword = useCallback(({ target: { value } }) => {
    setPassword(value);
  }, [setEmail]);

  const onBlurEmail = useCallback(async () => {
    setLoadingEmail(true);

    await dispatch(checkEmailAvailability(email));

    setBlurredEmail(true);
    setLoadingEmail(false);
  }, []);

  const onBlurUsername = useCallback(async () => {
    setLoadingUsername(true);

    await dispatch(checkUsernameAvailable(email));

    setBlurredUsername(true);
    setLoadingUsername(false);
  }, []);


  const onClickSignup = async () => {
    setLoadingCreate(true);

    await dispatch(createUser({ email, password, username }));

    setLoadingCreate(false);
  };

  const onNavigateLogin = useCallback(() => {
    const { history } = props;
    history.push('/login');
  }, []);


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
        alt="Hack a mole signup"
        className="login-logo"
        style={{
          flex: 1,
          height: 136,
          width: 136,
          paddingTop: 32,
          paddingBottom: 32,
        }} />
      <h1 className="login-title">
        Sign Up To Play
        </h1>
      {/** type={'email'} breaks the floaty label */}
      <MaterialInput
        label="Email"
        type="text"
        loading={loadingEmail}
        error={!availableEmail && !loadingEmail && blurredEmail}
        valid={!loadingEmail && availableEmail && blurredEmail}
        onChange={onChangeEmail}
        onBlur={onBlurEmail} />
      <MaterialInput
        label="Password"
        type="password"
        valid={passwordValid}
        error={!passwordValid && password}
        onChange={onChangePassword} />
      <MaterialInput
        label="Username"
        type="text"
        loading={loadingUsername}
        error={!availableUsername && !loadingEmail && blurredUsername}
        valid={!loadingUsername && availableUsername && blurredUsername}
        onChange={onChangeUsername}
        onBlur={onBlurUsername} />
      <MaterialButton
        buttonText="signup"
        disabled={loadingCreate || !ready}
        loading={loadingCreate}
        onClick={onClickSignup} />
      <TouchableButton onClick={onNavigateLogin}>
        <div style={{ marginBottom: 16, marginTop: 24 }}>
          <span style={{ fontSize: 24 }}>Already have an account?</span>
          <span style={{ fontSize: 24, color: '#FFF800' }}> Login</span>
        </div>
      </TouchableButton>
      {renderErrors()}
    </Panel>
  )
}

export default withRouter(Signup);
