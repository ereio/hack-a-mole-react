import React, { useEffect } from 'react';

// redux
import { useSelector } from 'react-redux';
import { store } from '../store';

// react router
import { Route, Switch } from 'react-router';
import { useHistory } from 'react-router-dom';

// screen components
import Game from './game';
import Review from './review';
import { History } from './history';
import { Login } from './login';
import { Signup } from './signup';

// local styling
import './styles.css';

// services
import { initApolloClient } from 'services/hack-a-mole';
import { initAuthListener } from '../store/auth/actions';

const {
  REACT_APP_API = 'https://mole-api.ere.io',
  REACT_APP_API_GRAPHQL = 'https://mole-api.ere.io/graphql',
  REACT_APP_API_WEBSOCKET = 'wss://mole-api.ere.io/graphql',
} = process.env;

export const App = () => {
  const history = useHistory();

  const authenticated = useSelector((state) => state.auth.authenticated);

  // init api and auth listeners
  useEffect(() => {
    initApolloClient(store.getState, {
      httpUri: REACT_APP_API_GRAPHQL,
      websocketUri: REACT_APP_API_WEBSOCKET,
    });
    store.dispatch(initAuthListener({
      httpsUrl: REACT_APP_API,
    }));
  }, []);

  // check if auth user has updated
  useEffect(() => {
    if (!authenticated && history.location.pathname !== '/login') {
      history.replace('/login');
    } else if (authenticated && history.location.pathname !== '/game') {
      history.replace('/game');
    }
  }, [authenticated]);

  return (
    <div className="app">
      <header className="app-container">
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/game" component={Game} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/review" component={Review} />
          <Route path="/history" component={History} />
        </Switch>
      </header>
    </div>
  );
};