import * as types from './actions';

const initialState = {
    isLoading: false,
    isAuthenticated: false,
    isNameAvailable: false,
    unregisterAuthObserver: null,
    current: {},
    errors: []
};

export default function user(state = initialState, action = {}) {
    console.log(action.type, action, state);
    switch (action.type) {
        case types.LOGIN_SUCCESS:
        case types.CHECK_AUTHENTICATED_SUCCESS:
            return {
                ...state,
                errors: [],
                current: action.user,
                isAuthenticated: action.isAuthenticated,
                isLoading: false,
            }
        case types.CREATE_USER_SUCCESS:
            return {
                ...state,
                errors: [],
                isAuthenticated: true,
                isLoading: false,
            }
        case types.CREATE_USER_FAILURE:
            const createUserErrors = [action.error];
            return {
                ...state,
                isAuthenticated: true,
                isNameAvailable: true,
                isLoading: false,
                errors: createUserErrors
            }
        case types.CHECK_USER_AVAILABLE_SUCCESS:
            return {
                ...state,
                isNameAvailable: true,
                isLoading: false,
            }

        case types.CHECK_USER_AVAILABLE_FAILURE:
            const userAvailableErrors = [action.error];
            return {
                ...state,
                isNameAvailable: false,
                isLoading: false,
                errors: userAvailableErrors
            }
        case types.CHECK_AUTHENTICATED:
            return {
                ...state,
                unregisterAuthObserver: action.unregisterAuthObserver
            }
        case types.LOGIN:
        case types.LOGOUT:
        case types.CREATE_USER:
        case types.CHECK_USER_AVAILABLE:
            return {
                ...state,
                isLoading: true,
            }
        case types.LOGIN_FAILURE:
        case types.LOGOUT_FAILURE:
            const loginErrors = [action.error];
            return {
                ...state,
                errors: loginErrors,
                isLoading: false,
            };
        default:
            return state;
    }
}