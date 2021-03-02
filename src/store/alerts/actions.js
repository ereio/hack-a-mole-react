
export const ADD_ALERT = 'ADD_ALERT';
export const RESET_ALERTS = 'RESET_ALERTS';
export const ADD_CONFIRMATON = 'ADD_CONFIRMATON';

export const addAlert = ({ message, origin, fallback }) => (dispatch) => {
  const content = message.message || message.toString();
  console.error(origin ? `[${origin}]` : '[addAlert]', content);
  dispatch({ type: ADD_ALERT, message: content });
};

export const addConfirmation = ({ message, origin }) => (dispatch) => {
  dispatch({ type: ADD_CONFIRMATON, message });
};
export const resetAlerts = () => (dispatch) => {
  dispatch({ type: RESET_ALERTS });
};
