import { createStore, applyMiddleware, combineReducers, compose} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from 'domain';

// react router navigation history 
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

// redux reducers
const initialState = {};
const rootReducer = combineReducers({...reducers, router: routerReducer})

// middleware for async and browser history
const history = createHistory();
const middleware = [thunk, routerMiddleware(history)];
const composedEnhancers = compose(applyMiddleware(...middleware));

// store init
const store = createStore(rootReducer, applyMiddleware(thunk));

export { store, history }; 