

import user from './user/reducer';
import stats from './stats/reducer';
import board from './board/reducer';
import game from './game/reducer';

// would want to combineReducers with an index of several reducers
// here if there was more domain flows, you could combine by purpose
// in the package by feature flow, and create an index
// i.e. 
// intro -|
//        | - signup
//        | - login
//        | - tutorial
//        | - index.js
// feed  -|
//        | - posts
//        | - friends
//        | - etc
//        | - index.js

export {
    user,
    stats,
    board,
    game
}
