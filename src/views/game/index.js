import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';


// actions
import { logoutUser } from 'store/user/actions';
import { startGame } from 'store/game/actions';

// global components
import { MaterialButton } from 'global/components/material/button';

// local components
import Board from './board';

import './styles.css';

class Game extends Component {
  constructor() {
    super();

    this.onClickReady = this.onClickReady.bind(this);
    this.renderReadyPanel = this.renderReadyPanel.bind(this);
    this.renderTimeRemaining = this.renderTimeRemaining.bind(this);
  }

  componentWillUnmount() {
    const { onLogoutUser } = this.props;
    onLogoutUser();
  }

  onClickReady() {
    const { onStartGame } = this.props.game;
    onStartGame();
  }

  renderReadyPanel() {
    const { isStarted } = this.props.game;
    return (
      <div>
        <MaterialButton buttonText="Ready?" disabled={isStarted} onClick={this.onClickReady} />
      </div>
    );
  }

  renderTimeRemaining() {
    const { startTime, endTime, isStarted } = this.props.game;

    if (isStarted) {
      return (
        <div className="time">{`Time: ${startTime.diff(endTime).format('m:ss')}`}</div>
      );
    }
    return undefined;
  }

  render() {
    const { isStarted, score } = this.props.game;
    const { email } = this.props.user.current;

    return (
      <div className="game">
        <div className="stats-container">
          <div className="score">{`Score: ${score}`}</div>
          {this.renderTimeRemaining()}
        </div>
        <div className="game-board-container">
          {isStarted ? this.renderReadyPanel() : <Board />}
        </div>
        <div className="info-container">
          <span className="message">
            {' '}
            {`Welcome ${email}`}
          </span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.user,
  game: state.game,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onLogoutUser: logoutUser,
  onStartGame: startGame,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));
