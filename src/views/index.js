import React, { useEffect } from 'react';

// redux
import { useSelector } from 'react-redux';

import { store } from '../store';

// react router
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';

// screen components
import Game from './game';
import Login from './login';
import Signup from './signup';
import Review from './review';
import History from './history';

// local styling
import './styles.css';

// services
import { initApiClient } from 'global/api';
import { initAuthListener } from '../store/auth/actions';

const { REACT_APP_API_GRAPHQL, REACT_APP_API_WEBSOCKET } = process.env;

const App = (props) => {
  const { history } = props;

  const authenticated = useSelector(state => state.auth.authenticated);

  // init api and auth listeners
  useEffect(() => {
    initApiClient(store.getState, {
      API_GRAPHQL: REACT_APP_API_GRAPHQL,
      API_WEBSOCKET: REACT_APP_API_WEBSOCKET,
    });
    store.dispatch(initAuthListener(history));
  }, [])

  // check if auth user has updated
  useEffect(() => {
    if (!authenticated && history.location.pathname === '/game') {
      history.replace('/login');
    } else if (authenticated && history.location.pathname !== '/game') {
      history.replace('/game');
    }
  }, [authenticated])

  return (
    <div className="App">
      <header className="App-header">
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
}

export default withRouter(App);
