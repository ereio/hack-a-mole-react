import gql from 'graphql-tag';

import { apolloClient } from 'services/hack-a-mole';

export const ADD_USER = 'ADD_USER';
export const SET_USERS = 'SET_USERS';


export const FETCH_USER_ATTEMPT = 'FETCH_USER_ATTEMPT';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchCurrentUser = () => async (dispatch, getState) => {
  try {
    const authId = getState().auth.user.uid;

    const response = await apolloClient.query({
      query: gql`
        query currentUser{
          currentUser {
            id
            gameIds
            username
          }
        }
      `,
      variables: {
        authId,
      },
    });

    const { data, error } = response;

    if (!error) {
      // eslint-disable-next-line
      throw 'Failed to find user, create a new one';
    }

    const { currentUser } = response.data;

    dispatch({ type: FETCH_USER_SUCCESS, currentUser });
    dispatch({ type: SET_USERS, users: { [currentUser.id]: currentUser } });

  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      currentUser: {},
    });
  }
};
