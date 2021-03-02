import gql from 'graphql-tag';

import { apolloClient } from 'services/hack-a-mole';

import { addAlert, addConfirmation, resetAlerts } from '../alerts/actions';

// action types
export const SET_AUTH = 'SET_AUTH';
export const SET_LOADING = 'SET_LOADING';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const CREATE_USER_ATTEMPT = 'CREATE_USER_ATTEMPT';
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
    dispatch({ type: CREATE_USER_ATTEMPT });
    console.log(email, username, password);

    const { data, errors } = await apolloClient.mutate({
      mutation: gql`
        mutation signupUser($authInput: AuthInput!) {
          signupUser(authInput: $authInput)
        }
      `,
      variables: {
        authInput: {
          email,
          password,
          username,
        }
      },
    });

    if (!data || errors) {
      throw Error('Could not create an account, please try again');
    }

    dispatch({ type: CREATE_USER_SUCCESS });
    dispatch(resetAlerts());
    dispatch(addConfirmation({ message: 'Successfully created user account!' }));
    return true;
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error,
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

    const { data, errors } = await apolloClient.mutate({
      mutation: gql`
        mutation loginUser($loginInput: LoginInput!) {
          loginUser(loginInput: $loginInput){
            id
            token
          }
        }
      `,
      variables: {
        loginInput: {
          email,
          password,
        }
      },
    });


    const { loginUser } = data;

    if (!loginUser || errors) {
      // eslint-disable-next-line
      throw 'Failed to authenticate username or password';
    }

    dispatch({ type: SET_AUTH, user: loginUser });

  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error,
      orgin: 'loginUser',
    }));
    dispatch({ type: SET_AUTH });
  } finally {
    dispatch({ type: SET_LOADING, loading: true });
  }
};

/**
 * Logout User
 */
export const logoutUser = () => async () => {
  try {
    await apolloClient.mutate({
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

  // firebase.auth().onIdTokenChanged(async (user) => {
  //   if (user) {
  //     dispatch({
  //       type: SET_AUTH,
  //       user: firebase.auth().currentUser,
  //       authenticated: true,
  //     });

  //     // Fetch Authenticated Data
  //     await dispatch(fetchCurrentUser());
  //     history.replace('/game');
  //   } else {
  //     history.replace('/login');
  //   }
  //   console.log('[initAuthListener] completed');
  // });
};


export const checkEmailAvailability = (email) => async (dispatch) => {
  try {
    dispatch({ type: CHECK_EMAIL_AVAILABLE_ATTEMPT });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log(email);

    const { data, error } = await apolloClient.query({
      query: gql`
        query checkAvailableEmail($email: String) {
          checkAvailableEmail(email: $email)
        }
      `,
      variables: { email },
    });

    if (!data || error) {
      console.error(data, error);
      // eslint-disable-next-line
      throw 'Failed to check email availability, try again later';
    }

    const { checkAvailableEmail } = data;

    dispatch({
      type: CHECK_EMAIL_AVAILABLE_SUCCESS,
      available: checkAvailableEmail,
    });

  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.toString(),
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

    const response = await apolloClient.query({
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
