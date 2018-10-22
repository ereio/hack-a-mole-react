import React, { Component } from 'react';

// redux 
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// react router 
import { withRouter } from 'react-router-dom';

// libs
import moment from 'moment';

//global components
import { MaterialButton } from 'global/components/material/button';

// local components
import Board from './board';

import './styles.css';

class Game extends Component {
  constructor() {
    super();

    this.onClickReady = this.onClickReady.bind(this);
  }

  onClickReady() {
    const { startGame } = this.props.game;
    startGame();
  }

  renderReadyPanel() {
    const { isStarted } = this.props.game;
    return (
      <div>
        <MaterialButton buttonText={"Ready?"} disabled={isStarted} onClick={this.onClickReady} />
      </div>
    )
  }

  renderTimeRemaining({startTime, endTime, isStarted}){
    if(isStarted){ 
      return (
        <div className="time">{"Time: " + startTime.diff(endTime).format("m:ss")}</div>
      ) 
    }
  }
  render() {
    const { user, game } = this.props; 

    return (
      <div className="game">
        <div className="stats-container">
          <div className="score">{"Score: " + 0}</div>
          {this.renderTimeRemaining(game)}
        </div>
        <div className="game-board-container">
          {}
          {game.isStarted ? this.renderReadyPanel() : <Board />}
        </div>
        <div className="info-container">
          <span className="message"> {"Welcome " + user.name}</span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({ user: state.user, game: state.game });

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps)(Game)); 