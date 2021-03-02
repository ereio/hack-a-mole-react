import React from 'react';
import ReactDOM from 'react-dom';

// Redux linking
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import dotenv from 'dotenv';
import { store, history } from './store';

// usually used for navigation
import { App } from './views';

// global styling
import './index.css';

// dotenv
dotenv.config();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);