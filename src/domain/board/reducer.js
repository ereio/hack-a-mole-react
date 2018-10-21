import * as types from './actions'; 

const initialState = { 
};

// using the spread operator and filters allows for every 
// array operation to be more immutable in  nature 
// dan does it too :)
// https://egghead.io/lessons/react-redux-avoiding-array-mutations-with-concat-slice-and-spread
export default function stats(state = initialState, action = {}) { 
    console.log(action.type, action);
    switch (action.type) { 
        default:
            return state;
    }
}