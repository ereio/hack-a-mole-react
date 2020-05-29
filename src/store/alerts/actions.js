
export const ADD_ALERT = 'ADD_ALERT';
export const RESET_ALERTS = 'RESET_ALERTS';
export const ADD_CONFIRMATON = 'ADD_CONFIRMATON';

export const addAlert = ({ message, origin }) => (dispatch) => {
  console.error(origin ? `[${origin}]` : '[addAlert]', message);
  dispatch({ type: ADD_ALERT, message });
};

export const addConfirmation = ({ message, origin }) => (dispatch) => {
  dispatch({ type: ADD_CONFIRMATON, message });
};
export const resetAlerts = () => (dispatch) => {
  dispatch({ type: RESET_ALERTS });
};
