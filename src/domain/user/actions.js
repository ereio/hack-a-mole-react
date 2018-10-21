
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const CHECK_USER_EXISTS = "CHECK_USER";
export const CHECK_USER_EXISTS_SUCCESS = 'CHECK_USER_SUCCESS';
export const CHECK_USER_EXISTS_FAILURE = 'CHECK_USER_FAILURE';

export const createUser = (username, password) => {
    return(dispatch) => {
        dispatch({
            type: CREATE_USER
        })

        dispatch({
            type: CREATE_USER_SUCCESS
        })
    }
}

export const loginUser = (username, password) => {
    return(dispatch) => {
        const user = {
            name: "Joe Test",
            highscore: 0,
        };
        
        dispatch({
            type: LOGIN
        })

        dispatch({
            type: LOGIN_SUCCESS, user
        })
    }
}

export const logoutUser = (username) => {
    return(dispatch) => {
        dispatch({
            type: LOGOUT
        })

        dispatch({
            type: LOGOUT_SUCCESS
        })
    }
}

export const checkUsernameExists = (username) => {
    return(dispatch) => {
        dispatch({
            type: CHECK_USER_EXISTS
        })

        dispatch({
            type: CHECK_USER_EXISTS_SUCCESS
        })
    }
}

export const checkAuthenticated = () => {
    
}

