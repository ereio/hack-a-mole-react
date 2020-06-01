import gql from 'graphql-tag';

import { apiClient } from '../../global/api';

export const FETCH_USER_ATTEMPT = 'FETCH_USER_ATTEMPT';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchCurrentUser = () => async (dispatch, getState) => {
  try {
    const authId = getState().auth.user.uid;

    const response = await apiClient.query({
      query: gql`
        query user($authId: ID) {
          user(authId: $authId){
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

    console.log(response);

    if (!response) {
      // eslint-disable-next-line
      throw 'Failed to find user, create a new one';
    }

    const currentUser = response.data.user;

    dispatch({
      type: FETCH_USER_SUCCESS,
      currentUser,
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      currentUser: {},
    });
  }
};
