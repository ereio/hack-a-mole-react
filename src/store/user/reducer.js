import * as types from './actions';

import initialState from './state';

export default function user(state = initialState(), action = {}) {
  // TODO: for debugging
  // console.log(action.type, action, state);
  switch (action.type) {
    case types.FETCH_USER_SUCCESS:
      return {
        ...state,
        currentUser: action.currentUser,
      };
    default:
      return state;
  }
}
