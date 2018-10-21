import React, { Component } from 'react';

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Route } from 'react-router';
import { withRouter } from 'react-router-dom';

// scene components
import Login from 'views/login';
import Game from 'views/game';

// local styling
import './styles.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/game" component={Game} />
        </header>
      </div>
    );
  }
}

// TODO - set state needed at app layer
const mapStateToProps = state => ({});

// TODO - set actions needed at app layer
const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App)); 
