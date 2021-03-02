import React, {
  useCallback, useEffect, useMemo, useState
} from 'react';

// redux
import { useDispatch, useSelector } from 'react-redux';

// react
import { useHistory } from 'react-router-dom';

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
import {
  Panel, TouchableButton, MaterialInput, MaterialButton, ErrorList
} from '../components';
import strings from 'global/strings';

export const Signup = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const errors = useSelector((state) => state.alerts.errors);
  const availableEmail = useSelector((state) => state.auth.emailAvailable);
  const availableUsername = useSelector((state) => state.auth.usernameAvailable);

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [ready, setReady] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [blurredEmail, setBlurredEmail] = useState(false);
  const [blurredUsername, setBlurredUsername] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingUsername, setLoadingUsername] = useState(false);

  const validPassword = useMemo(
    () => password.length > MIN_PASSWORD_LENGTH,
    [password]
  );

  // effects
  useEffect(() => {
    dispatch(resetAlerts());
  }, [email, username]);

  useEffect(() => {
    setReady(validPassword && availableEmail && availableUsername);
  }, [availableEmail, availableUsername, password]);

  // onChange handlers
  const onChangeEmail = useCallback(({ target: { value } }) => {
    setEmail(value);
  }, [setEmail]);

  const onChangeUsername = useCallback(({ target: { value } }) => {
    setUsername(value);
  }, [setUsername]);

  const onChangePassword = useCallback(({ target: { value } }) => {
    setPassword(value);
  }, [setPassword]);

  // onBlur handlers
  const onBlurEmail = useCallback(async () => {
    setLoadingEmail(true);

    await dispatch(checkEmailAvailability(email));

    setBlurredEmail(true);
    setLoadingEmail(false);
  }, [email]);

  const onBlurUsername = useCallback(async () => {
    setLoadingUsername(true);

    await dispatch(checkUsernameAvailable(username));

    setBlurredUsername(true);
    setLoadingUsername(false);
  }, [username]);

  // onClick handlers
  const onClickSignup = async () => {
    setLoadingCreate(true);

    const success = await dispatch(createUser({ email, password, username }));

    if (success) {
      onNavigateLogin();
    }
    setLoadingCreate(false);
  };

  const onNavigateLogin = useCallback(() => {
    dispatch(resetAlerts());
    history.push('/login');
  }, [dispatch, history]);

  return (
    <Panel>
      <MoleIcon
        alt="Hack a mole signup"
        style={styles.signupIcon} />
      <h1 style={styles.signupTitle}>
        Sign Up To Play
      </h1>
      {/** type={'email'} breaks the floaty label */}
      <MaterialInput
        type="text"
        label={strings.email}
        loading={loadingEmail}
        error={!availableEmail && !loadingEmail && blurredEmail}
        valid={!loadingEmail && availableEmail && blurredEmail}
        onChange={onChangeEmail}
        onBlur={onBlurEmail} />
      <MaterialInput
        type="password"
        label={strings.password}
        valid={validPassword}
        error={!validPassword && password}
        onChange={onChangePassword} />
      <MaterialInput
        type="text"
        label={strings.username}
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
      <div style={{ paddingBottom: 32 }}>
        <ErrorList errors={errors} />
      </div>
    </Panel>
  );
};

// Example of pre-defined styles
// similar in appearance to react-native
const styles = {
  signupIcon: {
    flex: 1,
    height: 136,
    width: 136,
    paddingTop: 32,
    paddingBottom: 32,
    marginTop: 24,
  },
  signupTitle: {
    fontSize: 40,
    marginTop: 16,
    marginBottom: 40,
  }
};