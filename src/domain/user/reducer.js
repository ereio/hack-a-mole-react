import * as types from './actions';

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    isNameAvailable: false,
    current: {},
    errors: []
};

export default function user(state = initialState, action = {}) { 
    switch (action.type) {
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                errors: [],
                current: action.user,
                isAuthenticated: true,
                isLoading: false,
            }  
        case types.CREATE_USER_SUCCESS:
            return {
                ...state,
                errors: [],
                isAuthenticated: true,
                isLoading: false,
            }
        case types.CHECK_USER_EXISTS_SUCCESS:
            return {
                ...state,
                isNameAvailable: true,
                isLoading: false,
            }

        case types.CHECK_USER_EXISTS_FAILURE:
            return {
                ...state,
                isNameAvailable: false,
                isLoading: false,
            }
        case types.LOGIN:
        case types.LOGOUT:
        case types.CREATE_USER:
        case types.CHECK_USER_EXISTS:
            return {
                ...state,
                isLoading: true,
            }
        case types.LOGIN_FAILURE:
        case types.LOGOUT_FAILURE: 
            return {
                ...state,
                errors: action.errors,
                isLoading: false,
            };
        default:
            return state;
    }
}