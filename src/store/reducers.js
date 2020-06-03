
import alerts from './alerts/reducer';
import auth from './auth/reducer';
import users from './users/reducer';
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
  alerts,
  auth,
  users,
  game,
};
