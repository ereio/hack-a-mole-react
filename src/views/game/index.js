import React, { Component } from 'react';

// redux 
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// react router 
import { withRouter } from 'react-router-dom';

// libs
import moment from 'moment';

// actions
import { logoutUser } from 'domain/user/actions';

// global components
import { MaterialButton } from 'global/components/material/button';

// local components
import Board from './board';

import './styles.css';

class Game extends Component {
  constructor() {
    super();

    this.onClickReady = this.onClickReady.bind(this);
  }

  componentWillUnmount() {
    const { logoutUser } = this.props;
    logoutUser();
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

  renderTimeRemaining({ startTime, endTime, isStarted }) {
    if (isStarted) {
      return (
        <div className="time">{"Time: " + startTime.diff(endTime).format("m:ss")}</div>
      )
    }
  }

  render() {
    const { game } = this.props;
    const { email } = this.props.user.current;
    return (
      <div className="game">
        <div className="stats-container">
          <div className="score">{"Score: " + game.score}</div>
          {this.renderTimeRemaining(game)}
        </div>
        <div className="game-board-container">
          {game.isStarted ? this.renderReadyPanel() : <Board />}
        </div>
        <div className="info-container">
          <span className="message"> {"Welcome " + email}</span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({ user: state.user, game: state.game });

const mapDispatchToProps = dispatch => bindActionCreators({
  logoutUser,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game)); 