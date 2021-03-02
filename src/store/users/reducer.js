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
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    default:
      return state;
  }
};
