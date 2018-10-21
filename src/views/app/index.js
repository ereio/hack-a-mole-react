import React, { Component } from 'react';

// redux 
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// react router
import { Route } from 'react-router';
import { withRouter } from 'react-router-dom'; 

// scene components
import Login from 'views/login';
import Game from 'views/game';

// local styling
import './styles.css';

class App extends Component { 
  componentDidMount() { 
    this.redirectUnauthed();
  }

  componentDidUpdate(){ 
    this.redirectUnauthed();
  }

  // redirects users if they attempt to access the game directly
  redirectUnauthed(){
    const {history} = this.props;
    const {authenticated} = this.props.user;

    console.log(history);
    if(!authenticated && history.location.pathname != "/login"){ 
      history.replace( '/login' );
    }
  }

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
 
const mapStateToProps = state => ({user: state.user});
 
// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps)(App)); 
