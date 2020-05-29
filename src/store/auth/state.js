export default function initialState() {
  return {
    user: {},
    loadng: false,
    authenticated: false,
    emailAvailable: undefined,
    usernameAvailable: undefined,
    unregisterAuthObserver: null,
  };
}
