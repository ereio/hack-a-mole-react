import * as types from './actions'; 

// libs
import moment from 'moment';

const initialState = { 
    isActive: false,
    isStarted: false, 
    startTime: 0,
    endTime: 0,
    rows: ["A","B","C"],
    holes: ["1","2","3"],
    score: 0,
    moles : [],
};
 
export default function game(state = initialState, action = {}) {  

    switch (action.type) { 
        case types.START_GAME:
        return {
            ...state,
            isStarted: true, 
            startTime: moment(),
            endTime: moment().addl(1, 'minute')
        }
        case types.START_GAME_FINISHED:
        return {
            ...state,
            isActive: true,
        }
         case types.END_GAME:
        return {
            ...state,
            isStarted: false, 
            startTime: 0,
            endTime: 0,
            moles: [],
        }
        case types.END_GAME_FINISHED:
        return {
            ...state,
            isActive: false,
        }
        default:
            return state;
    }
}