
// libs
import firebase from 'global/firebase';

// action types
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const CHECK_USER_AVAILABLE = "CHECK_USER_AVAILABLE";
export const CHECK_USER_AVAILABLE_SUCCESS = 'CHECK_USER_AVAILABLE_SUCCESS';
export const CHECK_USER_AVAILABLE_FAILURE = 'CHECK_USER_AVAILABLE_FAILURE';

export const CHECK_AUTHENTICATED = "CHECK_AUTHENTICATED";
export const CHECK_AUTHENTICATED_SUCCESS = 'CHECK_AUTHENTICATED_SUCCESS';
export const UNCHECK_AUTHENTICATED = "UNCHECK_AUTHENTICATED";

// actions
export const createUser = (email, password) => {
    return (dispatch) => {
        dispatch({
            type: CREATE_USER
        })

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((response) => {
                console.log("CREATE RESPONSE", response);
                dispatch({
                    type: CREATE_USER_SUCCESS
                })
            })
            .catch((error) => {
                dispatch({
                    type: CREATE_USER_FAILURE,
                    error: error.message
                })
            });
    }
}

export const loginUser = (email, password) => {
    return (dispatch) => {
        dispatch({
            type: LOGIN
        })

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(({user}) => { 
                dispatch({
                    type: LOGIN_SUCCESS,
                    isAuthenticated: !!user,
                    user        
                })
            })
            .catch((error) => {
                dispatch({
                    type: LOGIN_FAILURE,
                    error: error.message
                })
            });
    }
}

export const logoutUser = (email) => {
    return (dispatch) => {

        dispatch({
            type: LOGOUT
        })

        firebase.auth().signOut()
            .then(() => {
                dispatch({
                    type: LOGOUT_SUCCESS
                })
            })
            .catch((error) => {
                dispatch({
                    type: LOGOUT_FAILURE,
                    error: error.message
                })
            })

    }
}

export const checkUsernameAvailable = (email) => {
    return (dispatch) => {
        dispatch({
            type: CHECK_USER_AVAILABLE
        })
        firebase.auth().signInWithEmailAndPassword(email, "check")
            .catch((error) => {
                if (error.code === "auth/user-not-found") {
                    dispatch({
                        type: CHECK_USER_AVAILABLE_SUCCESS
                    })
                } else {
                    dispatch({
                        type: CHECK_USER_AVAILABLE_FAILURE,
                    })
                }
            });
    }
}

export const checkAuthenticated = () => {
    return (dispatch) => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged((user) => {
            dispatch({
                type: CHECK_AUTHENTICATED_SUCCESS,
                isAuthenticated: !!user,
                current: user
            });
        });

        dispatch({
            type: CHECK_AUTHENTICATED,
            unregisterAuthObserver
        });
    }
}


export const uncheckAuthenticated = () => {
    return (dispatch, getState) => {
        const { unregisterAuthObserver } = getState().user;

        unregisterAuthObserver();

        dispatch({
            type: UNCHECK_AUTHENTICATED,
            unregisterAuthObserver: null
        });
    }
}
