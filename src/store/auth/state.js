export const initialState = () => {
  return {
    user: {},
    loadng: false,
    authenticated: false,
    emailAvailable: undefined,
    usernameAvailable: undefined,
    unregisterAuthObserver: null,
  };
};
