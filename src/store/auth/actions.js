import gql from 'graphql-tag';

import { apiClient } from '../../global/api';
// firebase for auth
import { firebase } from '../../global/firebase';
import { fetchCurrentUser } from '../user/actions';
import { addAlert, resetAlerts } from '../alerts/actions';

// action types
export const SET_LOADING = 'SET_LOADING';
export const SET_AUTH_USER = 'SET_AUTH_USER';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const CHECK_EMAIL_AVAILABLE_ATTEMPT = 'CHECK_EMAIL_AVAILABLE_ATTEMPT';
export const CHECK_EMAIL_AVAILABLE_SUCCESS = 'CHECK_EMAIL_AVAILABLE_SUCCESS';
export const CHECK_EMAIL_AVAILABLE_FAILURE = 'CHECK_EMAIL_AVAILABLE_FAILURE';

export const CHECK_USER_AVAILABLE_ATTEMPT = 'CHECK_USER_AVAILABLE_ATTEMPT';
export const CHECK_USER_AVAILABLE_SUCCESS = 'CHECK_USER_AVAILABLE_SUCCESS';
export const CHECK_USER_AVAILABLE_FAILURE = 'CHECK_USER_AVAILABLE_FAILURE';


// actions
export const createUser = ({
  email,
  password,
  username,
}) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_USER });

    const response = await apiClient.mutate({
      mutation: gql`
        mutation signupUser($email: String!, $password: String!, $username: String!) {
          signupUser(email: $email, password: $password, username: $username)
        }
      `,
      variables: {
        email,
        password,
        username,
      },
    });

    const { data } = response;

    if (!data) {
      throw Error('Could not create an account, please try again');
    }

    dispatch({ type: CREATE_USER_SUCCESS });
    dispatch(resetAlerts());
    return true;
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: 'Failed to create user, please try again',
      origin: 'createUser',
    }));
    dispatch({ type: CREATE_USER_FAILURE });
    return false;
  }
};


export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });
    dispatch(resetAlerts());

    const response = await apiClient.mutate({
      mutation: gql`
        mutation loginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password){
            id
            token
          }
        }
      `,
      variables: {
        email,
        password,
      },
    });

    console.log(response);

    const currentAuthUser = response.data.loginUser;

    if (!currentAuthUser) {
      // eslint-disable-next-line
      throw 'Failed to authenticate username or password';
    }

    await firebase.auth().signInWithCustomToken(currentAuthUser.token);
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      orgin: 'loginUser',
    }));
    dispatch({ type: SET_AUTH_USER, authenticated: false });
  } finally {
    dispatch({ type: SET_LOADING, loading: true });
  }
};

/**
 * Logout User
 */
export const logoutUser = () => async () => {
  try {
    firebase.auth().signOut();
    await apiClient.mutate({
      mutation: gql`
        mutation signOut {
          signOut
        }
      `,
    });
  } catch (error) {
    console.error('[signOut]', error);
  }
};


/**
 * Init Auth Listener
 */
export const initAuthListener = (history) => (dispatch) => {
  console.log('[initAuthListener] starting');

  firebase.auth().onIdTokenChanged(async (user) => {
    if (user) {
      dispatch({
        type: SET_AUTH_USER,
        user: firebase.auth().currentUser,
        authenticated: true,
      });

      // Fetch Authenticated Data
      await dispatch(fetchCurrentUser());
      history.replace('/game');
    } else {
      history.replace('/login');
    }
    console.log('[initAuthListener] completed');
  });
};


export const checkEmailAvailability = (email) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_EMAIL_AVAILABLE_ATTEMPT });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await apiClient.query({
      query: gql`
        query checkAvailableEmail($email: String!) {
          checkAvailableEmail(email: $email)
        }
      `,
      variables: { email },
    });

    const { data } = response;

    dispatch({
      type: CHECK_EMAIL_AVAILABLE_SUCCESS,
      available: data.checkAvailableEmail,
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: 'Email not available',
      orgin: 'checkEmailAvailability',
    }));
    dispatch({
      type: CHECK_EMAIL_AVAILABLE_FAILURE,
      available: false,
    });
  }
};

export const checkUsernameAvailable = (username) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_USER_AVAILABLE_ATTEMPT });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const response = await apiClient.query({
      query: gql`
          query checkAvailableUsername($username: String!) {
            checkAvailableUsername(username: $username)
          }
        `,
      variables: { username },
    });

    const { data } = response;

    dispatch({
      type: CHECK_USER_AVAILABLE_SUCCESS,
      available: data.checkAvailableUsername,
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: 'Username not available',
      orgin: 'checkUsernameAvailable',
    }));
    dispatch({
      type: CHECK_USER_AVAILABLE_FAILURE,
      available: false,
    });
  }
};
