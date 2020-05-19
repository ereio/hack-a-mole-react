import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import thunk from 'redux-thunk';


// react router navigation history
import { routerReducer, routerMiddleware } from 'react-router-redux';

import { createBrowserHistory as createHistory } from 'history';

import * as reducers from './state';

// redux reducers
const rootReducer = combineReducers({
  ...reducers,
  router: routerReducer,
});

// middleware for async and browser history
const history = createHistory();
const middleware = [thunk, routerMiddleware(history)];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composedEnhancers = composeEnhancers(applyMiddleware(...middleware));

// store init
const store = createStore(rootReducer, composedEnhancers);

export { store, history };
