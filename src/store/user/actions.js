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

export const CHECK_EMAIL_AVAILABLE_ATTEMPT = 'CHECK_EMAIL_AVAILABLE_ATTEMPT';
export const CHECK_EMAIL_AVAILABLE_SUCCESS = 'CHECK_EMAIL_AVAILABLE_SUCCESS';
export const CHECK_EMAIL_AVAILABLE_FAILURE = 'CHECK_EMAIL_AVAILABLE_FAILURE';

export const CHECK_USER_AVAILABLE_ATTEMPT = 'CHECK_USER_AVAILABLE_ATTEMPT';
export const CHECK_USER_AVAILABLE_SUCCESS = 'CHECK_USER_AVAILABLE_SUCCESS';
export const CHECK_USER_AVAILABLE_FAILURE = 'CHECK_USER_AVAILABLE_FAILURE';

export const CHECK_AUTHENTICATED = 'CHECK_AUTHENTICATED';
export const CHECK_AUTHENTICATED_SUCCESS = 'CHECK_AUTHENTICATED_SUCCESS';
export const UNCHECK_AUTHENTICATED = 'UNCHECK_AUTHENTICATED';

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
    console.log(data);

    if (!data) {
      throw Error('Could not create an account, please try again');
    }
    dispatch({ type: CREATE_USER_SUCCESS });
    return true;
  } catch (error) {
    console.error('[createUser]', error);
    dispatch({ type: CREATE_USER_FAILURE, error: 'Failed to create user, please try again' });
    return false;
  }
};

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: LOGIN_ATTEMPT });

    const loginResponse = await apiClient.mutate({
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

    const currentAuth = loginResponse.data.loginUser;

    if (!currentAuth) {
      // eslint-disable-next-line
      throw 'Failed to authenticate username or password';
    }

    dispatch({
      type: LOGIN_SUCCESS,
      isAuthenticated: !!currentAuth.token,
      currentAuth,
    });

    const userResponse = await apiClient.query({
      query: gql`
        query user($id: ID, $authId: ID) {
          user(id: $id, authId: $authId){
            id
            gameIds
            username
          }
        }
      `,
      variables: {
        authId: currentAuth.id,
      },
    });

    if (!currentAuth) {
      // eslint-disable-next-line
      throw 'Failed to find user, create a new one';
    }
    const currentUser = userResponse.data.user;

    dispatch({
      type: LOGIN_SUCCESS,
      isAuthenticated: !!currentAuth.token,
      currentAuth,
      currentUser,
    });
  } catch (error) {
    dispatch({
      type: LOGIN_FAILURE,
      isAuthenticated: false,
      error: error.toString(),
    });
  }
};

export const logoutUser = (email) => (dispatch) => {
  dispatch({
    type: LOGOUT,
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
    console.error('[checkEmailAvailability]', error);
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
    console.error('[checkUsernameAvailable]', error);
    dispatch({
      type: CHECK_USER_AVAILABLE_FAILURE,
      available: false,
    });
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
