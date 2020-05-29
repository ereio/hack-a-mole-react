import * as types from './actions';

import initialState from './state';

export default function alerts(state = initialState(), action = {}) {
  switch (action.type) {
    case types.ADD_ALERT:
      return {
        ...state,
        errors: [action.message],
      };
    case types.RESET_ALERTS:
      return {
        ...state,
        errors: [],
      };
    default:
      return state;
  }
}
