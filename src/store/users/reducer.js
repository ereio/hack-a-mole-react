import * as types from './actions';

import { initialState } from './state';

export const users = (state = initialState(), action = {}) => {
  // TODO: for debugging
  // console.log(action.type, action, state);
  switch (action.type) {
    case types.SET_USERS:
      return {
        ...state,
        users: action.users,
      };
    case types.FETCH_USER_ATTEMPT:
      return {
        ...state,
        loading: true,
      };
    case types.FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        currentUser: {},
      };
    case types.FETCH_USER_SUCCESS:
      const usersNew = state.users;
      usersNew[action.currentUser.id] = action.currentUser;

      return {
        ...state,
        loading: false,
        currentUser: action.currentUser,
        users: usersNew
      };
    default:
      return state;
  }
};
