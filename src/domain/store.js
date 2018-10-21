import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk'; 

import user from './user/reducer';
import score from './score/reducer';
import board from './board/reducer';
import game from './game/reducer';

// would want to combineReducers with an index of several reducers
// here if there was more domain than tasks
const rootReducer = combineReducers({user, score, board, game})
const store = createStore(rootReducer, applyMiddleware(thunk));

export {store};