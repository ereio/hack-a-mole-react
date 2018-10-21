import React, { Component } from 'react';

// redux 
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// react router 
import { withRouter } from 'react-router-dom';

//global components
import { MaterialButton } from 'global/components/material/button';

import './styles.css';

class Game extends Component {
  constructor() {
    super(); 
  }  

  render() {
    return (
      <div className="login-panel"> 
        <MaterialButton buttonText={"Login"} onClick={this.onClickLogin} />
      </div>
    );
  }
}
const mapStateToProps = state => ({user: state.user, game: state.game});
 
// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps)(Game)); 