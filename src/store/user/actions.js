import gql from 'graphql-tag';

import { apiClient } from '../../global/api';

export const FETCH_USER_ATTEMPT = 'FETCH_USER_ATTEMPT';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchCurrentUser = (authID) => async (dispatch) => {
  try {
    const response = await apiClient.query({
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
        authId: authID,
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
