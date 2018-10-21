import * as types from './actions';

const initialState = {
    authenticated: false,
    current: {},
    errors: []
};

export default function user(state = initialState, action = {}) {
    console.log(action.type, action);
    switch (action.type) {
        case types.LOGIN_FAILURE:
        case types.LOGOUT_FAILURE:
        case types.CREATE_USER_FAILURE:
        case types.CHECK_USER_EXISTS_FAILURE:
            return state;
        default:
            return state;
    }
}