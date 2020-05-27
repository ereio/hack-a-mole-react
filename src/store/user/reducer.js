import * as types from './actions';

const initialState = {
  errors: [],
  currentUser: {},
  isLoading: false,
  isAuthenticated: false,
  emailAvailable: true,
  usernameAvailable: true,
  unregisterAuthObserver: null,
};

export default function user(state = initialState, action = {}) {
  // TODO: for debugging
  // console.log(action.type, action, state);
  switch (action.type) {
    case types.LOGIN_SUCCESS:
    case types.CHECK_AUTHENTICATED_SUCCESS:
      return {
        ...state,
        errors: [],
        currentUser: action.user,
        isAuthenticated: action.isAuthenticated,
        isLoading: false,
      };
    case types.CREATE_USER_SUCCESS:
      return {
        ...state,
        errors: [],
        isAuthenticated: true,
        isLoading: false,
      };
    case types.CREATE_USER_FAILURE: {
      return {
        ...state,
        isUsernameAvailable: true,
        isLoading: false,
        errors: [action.error],
      };
    }
    case types.CHECK_EMAIL_AVAILABLE:
    case types.CHECK_EMAIL_AVAILABLE_SUCCESS:
      return {
        ...state,
        emailAvailable: action.available,
        isLoading: false,
      };
    case types.CHECK_EMAIL_AVAILABLE_FAILURE: {
      return {
        ...state,
        emailAvailable: false,
        isLoading: false,
        errors: [action.error],
      };
    }
    case types.CHECK_USER_AVAILABLE:
    case types.CHECK_USER_AVAILABLE_SUCCESS:
      return {
        ...state,
        usernameAvailable: action.available,
        isLoading: false,
      };
    case types.CHECK_USER_AVAILABLE_FAILURE: {
      return {
        ...state,
        usernameAvailable: false,
        isLoading: false,
        errors: [action.error],
      };
    }
    case types.CHECK_AUTHENTICATED:
      return {
        ...state,
        unregisterAuthObserver: action.unregisterAuthObserver,
      };
    case types.LOGIN_ATTEMPT:
    case types.LOGOUT:
    case types.CREATE_USER:
    case types.CHECK_USER_AVAILABLE:
      return {
        ...state,
        isLoading: true,
      };
    case types.LOGIN_FAILURE:
    case types.LOGOUT_FAILURE: {
      const loginErrors = [action.error];
      return {
        ...state,
        errors: loginErrors,
        isLoading: false,
      };
    }
    default:
      return state;
  }
}
