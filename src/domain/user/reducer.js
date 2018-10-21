import * as types from './actions'; 

const initialState = { 
};
 
export default function user(state = initialState, action = {}) { 
    console.log(action.type, action);
    switch (action.type) { 
        default:
            return state;
    }
}