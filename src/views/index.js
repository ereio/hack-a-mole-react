import React, { Component } from 'react';


// redux
import { connect } from 'react-redux';

// react router
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';

// main state manager
import { store } from '../store';

// screen components
import Game from './game';
import Login from './login';
import Signup from './signup';
import Review from './review';
import History from './history';

// local styling
import './styles.css';

// services
import { initApiClient } from '../global/api';
import { initAuthListener } from '../store/auth/actions';

const { REACT_APP_API_GRAPHQL, REACT_APP_API_WEBSOCKET } = process.env;

class App extends Component {
  componentDidMount() {
    const { history } = this.props;
    initApiClient(store.getState, {
      API_GRAPHQL: REACT_APP_API_GRAPHQL,
      API_WEBSOCKET: REACT_APP_API_WEBSOCKET,
    });
    store.dispatch(initAuthListener(history));
    this.checkAuthenticationRedirects();
  }

  componentDidUpdate() {
    this.checkAuthenticationRedirects();
  }

  // redirects users if they attempt to access the game directly
  checkAuthenticationRedirects() {
    const { history } = this.props;
    const { authenticated } = this.props;

    // NOTE: This will flicker because we'll never
    // be sure authentication when auth is finished checking
    // if (!authenticated && history.location.pathname === '/game') {
    //   history.replace('/login');
    // } else if (authenticated && history.location.pathname !== '/game') {
    //   history.replace('/game');
    // }
  }

  render() {
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
}

const mapStateToProps = (state) => ({ authenticated: state.auth.authenticated });

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps)(App));
