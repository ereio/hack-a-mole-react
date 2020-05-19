import React, { Component } from 'react';
import moment from 'moment';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import { logoutUser } from 'store/user/actions';
import { startGame } from 'store/game/actions';

// global components
import { FiSettings } from 'react-icons/fi';
import { MaterialButton } from 'global/components/material/button';
import { TouchableButton } from 'global/components/material/touchable';


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
    const { onStartGame } = this.props;
    onStartGame();
  }

  renderReadyPanel() {
    const { isStarted } = this.props.game;
    return (
      <div>
        <div style={{ marginBottom: '12px' }}>
          <MaterialButton
            buttonText="Leaderboards"
            disabled={isStarted}
            onClick={this.onClickReady}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <MaterialButton
            buttonText="Review Gameplay"
            disabled={isStarted}
            onClick={this.onClickReady}
          />
        </div>
        <div style={{ marginTop: '32px' }}>
          <MaterialButton
            buttonText="Start Game"
            disabled={isStarted}
            onClick={this.onClickReady}
          />
        </div>
      </div>
    );
  }

  renderTimeRemaining() {
    const { endTime, isStarted } = this.props.game;

    if (isStarted) {
      return (
        <div className="time">
          {`Time: ${moment(endTime).diff(moment(), 'seconds')}`}
        </div>
      );
    }
    return undefined;
  }

  render() {
    const { isStarted, score } = this.props.game;
    const { email } = this.props.user.current;

    return (
      <div className="game">
        <div className="container-stats">
          <div className="score">
            {`Score: ${score}`}
          </div>
          {this.renderTimeRemaining()}
          <div className="settings">
            <TouchableButton end onClick={() => {}}>
              <FiSettings />
            </TouchableButton>
          </div>
        </div>
        <div className="container-game-board">
          {isStarted ? <Board /> : this.renderReadyPanel() }
        </div>
        <div className="container-info">
          <span className="message">
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
