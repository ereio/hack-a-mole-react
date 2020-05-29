import * as types from './actions';

const initialState = {
  alerts: [],
};

export default function alerts(state = initialState, action = {}) {
  // TODO: for debugging
  // console.log(action.type, action, state);
  switch (action.type) {
    default:
      return state;
  }
}
