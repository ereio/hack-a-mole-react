import React, { Component } from 'react';

// redux
import { connect } from 'react-redux';

// react router
import { Route, Switch } from 'react-router';
import { withRouter } from 'react-router-dom';

// scene components
import Login from './login';
import Game from './game';

// local styling
import './styles.css';

class App extends Component {
  componentDidMount() {
    this.redirectUnauthed();
  }

  componentDidUpdate() {
    this.redirectUnauthed();
  }

  componentWillUnmount() {
    // Un-registers the auth state observer.
    this.unregisterAuthObserver();
  }

  // redirects users if they attempt to access the game directly
  redirectUnauthed() {
    const { history } = this.props;
    const { isAuthenticated } = this.props.user;

    if (!isAuthenticated && history.location.pathname !== '/login') {
      // history.replace('/login');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Switch>
            <Route exact path="/" component={Login} />
            <Route path="/login" component={Login} />
            <Route path="/game" component={Game} />
          </Switch>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.user });

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps)(App));
