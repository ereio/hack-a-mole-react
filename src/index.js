import React from 'react';
import ReactDOM from 'react-dom';

// Redux linking
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import dotenv from 'dotenv';
import { store, history } from './store';

// React Navigation

// service worker for offline support
import * as serviceWorker from './serviceWorker';

// dotenv

// extracting app into a view seperates its concern
// it's nothing but a glorified root view component,
// usually used for navigation
import App from './views/app';

// global styling
import './index.css';

dotenv.config();

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
