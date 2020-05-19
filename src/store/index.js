import {
  createStore, applyMiddleware, combineReducers, compose,
} from 'redux';
import thunk from 'redux-thunk';


// react router navigation history
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory as createHistory } from 'history';

// reducer prep
import * as reducers from './reducers';

const history = createHistory();

// redux reducers
const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
});

// middleware for async and browser history
const middleware = [thunk, routerMiddleware(history)];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const composedEnhancers = composeEnhancers(applyMiddleware(...middleware));

// store init
const store = createStore(rootReducer, composedEnhancers);

export { store, history };
