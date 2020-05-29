import React, { Component } from 'react';


// redux
import { connect } from 'react-redux';

// react router
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';


// main state manager
import { store } from '../store';

// scene components
import Signup from './signup';
import Login from './login';
import Game from './game';

// local styling
import './styles.css';

// services
import { initApiClient } from '../global/api';
import { initAuthListener } from '../store/auth/actions';

const { REACT_APP_API_GRAPHQL, REACT_APP_API_WEBSOCKET } = process.env;

class App extends Component {
  componentDidMount() {
    initApiClient(store.getState, {
      API_GRAPHQL: REACT_APP_API_GRAPHQL,
      API_WEBSOCKET: REACT_APP_API_WEBSOCKET,
    });
    initAuthListener();

    this.redirectUnauthed();
  }

  componentDidUpdate() {
    this.redirectUnauthed();
  }

  // redirects users if they attempt to access the game directly
  redirectUnauthed() {
    const { history } = this.props;
    const { authenticated } = this.props.auth;

    if (!authenticated && history.location.pathname === '/game') {
      history.replace('/login');
    }
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
          </Switch>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ auth: state.auth.authenticated });

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps)(App));
