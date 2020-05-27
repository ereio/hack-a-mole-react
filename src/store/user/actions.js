import gql from 'graphql-tag';

import { apiClient } from '../../global/api';

// action types
export const LOGIN_ATTEMPT = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const CHECK_EMAIL_AVAILABLE = 'CHECK_EMAIL_AVAILABLE';
export const CHECK_EMAIL_AVAILABLE_SUCCESS = 'CHECK_EMAIL_AVAILABLE_SUCCESS';
export const CHECK_EMAIL_AVAILABLE_FAILURE = 'CHECK_EMAIL_AVAILABLE_FAILURE';

export const CHECK_USER_AVAILABLE = 'CHECK_USER_AVAILABLE';
export const CHECK_USER_AVAILABLE_SUCCESS = 'CHECK_USER_AVAILABLE_SUCCESS';
export const CHECK_USER_AVAILABLE_FAILURE = 'CHECK_USER_AVAILABLE_FAILURE';

export const CHECK_AUTHENTICATED = 'CHECK_AUTHENTICATED';
export const CHECK_AUTHENTICATED_SUCCESS = 'CHECK_AUTHENTICATED_SUCCESS';
export const UNCHECK_AUTHENTICATED = 'UNCHECK_AUTHENTICATED';

// actions
export const createUser = (email, password) => (dispatch) => {
  dispatch({
    type: CREATE_USER,
  });
};

export const loginUser = (email, password) => (dispatch) => {
  dispatch({
    type: LOGIN_ATTEMPT,
  });

  dispatch({
    type: LOGIN_SUCCESS,
    isAuthenticated: !!{},
    user: {},
  });
};

export const logoutUser = (email) => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};

export const checkEmailAvailability = (email) => async (dispatch) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await apiClient.query({
      query: gql`
        query checkAvailableEmail($email: String!) {
          checkAvailableEmail(email: $email)
        }
      `,
      variables: { email },
    });

    console.log(response);

    const { data } = response;

    dispatch({
      type: CHECK_EMAIL_AVAILABLE,
      available: data.checkAvailableEmail,
    });
  } catch (error) {
    console.log(error);
  }
};

export const checkUsernameAvailable = (username) => async (dispatch) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const response = await apiClient.query({
      query: gql`
          query checkAvailableUsername($username: String!) {
            checkAvailableUsername(username: $username)
          }
        `,
      variables: { username },
    });

    console.log(response);

    const { data } = response;
    dispatch({
      type: CHECK_USER_AVAILABLE,
      available: data.checkAvailableUsername,
    });
  } catch (error) {
    console.log(error);
  }
};


export const checkAuthenticated = () => (dispatch) => {
  // const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
  //     dispatch({
  //         type: CHECK_AUTHENTICATED_SUCCESS,
  //         isAuthenticated: !!user,
  //         current: user
  //     });
  // });

  // TODO: STUB
  const unregisterAuthObserver = () => {};

  dispatch({
    type: CHECK_AUTHENTICATED,
    unregisterAuthObserver,
  });
};


export const uncheckAuthenticated = () => (dispatch, getState) => {
  // const { unregisterAuthObserver } = getState().user;

  // unregisterAuthObserver();

  // TODO: STUB
  const unregisterAuthObserver = () => {};

  dispatch({
    type: UNCHECK_AUTHENTICATED,
    unregisterAuthObserver,
  });
};
