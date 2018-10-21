import * as types from './actions'; 

const initialState = { 
};
 
export default function game(state = initialState, action = {}) { 
    console.log(action.type, action);
    switch (action.type) { 
        default:
            return state;
    }
}