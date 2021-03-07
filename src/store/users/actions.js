import gql from 'graphql-tag';

import { apolloClient } from 'services/hack-a-mole';

export const ADD_USER = 'ADD_USER';
export const SET_USERS = 'SET_USERS';


export const FETCH_USER_ATTEMPT = 'FETCH_USER_ATTEMPT';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchCurrentUser = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FETCH_USER_ATTEMPT });

    // uses contents of the httpOnly jwt on the backend
    // to only return the user associated with the auth account
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
    });

    // magic parsing of graphql payloads
    const { data: { currentUser }, errors = [] } = response || { data: {} };

    if (errors.length) {
      // eslint-disable-next-line
      throw 'Failed to find user, create a new one';
    }

    console.log(response);

    dispatch({ type: FETCH_USER_SUCCESS, currentUser });

  } catch (error) {
    console.error('[fetchCurrentUser]', error);
    dispatch({ type: FETCH_USER_FAILURE });
  }
};
