import React, { Component } from 'react';
import moment from 'moment';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import { startGame } from '../../store/game/actions';
import { logoutUser } from '../../store/auth/actions';

// global components
import { FiSettings } from 'react-icons/fi';
import { MaterialButton, TouchableButton } from '../../global/components';


// local components
import Board from './board';

import './styles.css';

class Game extends Component {
  constructor() {
    super();

    this.state = {
      timeLeft: this,
    };

    this.renderGame = this.renderGame.bind(this);
    this.renderMenu = this.renderMenu.bind(this);
    this.renderGameOver = this.renderGameOver.bind(this);

    this.onClickReady = this.onClickReady.bind(this);
  }

  async onClickReady() {
    const { onStartGame, timeLimit } = this.props;

    this.setState({ timeLeft: timeLimit - 1 });

    await onStartGame();

    const { endTime } = this.props.game;

    const timer = setInterval(() => {
      const timeLeft = moment(endTime).diff(moment(), 'seconds');
      this.setState({ timeLeft });
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 250);
  }

  renderGameOver() {
    const { isStarted, score } = this.props.game;
    const { history } = this.props;
    return (
      <div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <div style={{ paddingBottom: '12px' }}>
            Final Score
          </div>
          <div>
            {score}
          </div>
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="review gameplay"
            disabled={isStarted}
            onClick={() => history.push('/review')} />
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="start new game"
            disabled={isStarted}
            onClick={this.onClickReady} />
        </div>
      </div>
    );
  }

  renderMenu() {
    const { isStarted } = this.props.game;
    const { history } = this.props;
    return (
      <div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="leaderboards"
            disabled={isStarted}
            onClick={() => history.push('/leaderboard')} />
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="history"
            disabled={isStarted}
            onClick={() => history.push('/history')} />
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="start game"
            disabled={isStarted}
            onClick={this.onClickReady} />
        </div>
      </div>
    );
  }

  renderGame() {
    const { isActive, isStarted, isEnded } = this.props.game;
    if (isStarted || isActive) {
      return <Board />;
    }

    if (isEnded) {
      return this.renderGameOver();
    }

    return this.renderMenu();
  }

  render() {
    const { isStarted, score } = this.props.game;
    const { onLogoutUser, currentUser } = this.props;
    const { timeLeft } = this.state;

    return (
      <div className="game">
        <div className="container-stats">
          {isStarted
            ? (
              <div className="score">
                {`Score: ${score}`}
              </div>
            )
            : (<div className="score" />)}
          {isStarted ? (
            <div className="time">
              {`Time: ${timeLeft}`}
            </div>
          ) : (
              <span className="message">
                {`Welcome ${currentUser.username}`}
              </span>
            )}
          <div className="settings">
            <TouchableButton
              end
              onClick={() => onLogoutUser()}>
              <FiSettings />
            </TouchableButton>
          </div>
        </div>
        <div className="container-game-board">
          {this.renderGame()}
        </div>
        <div className="container-info" />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  game: state.game,
  timeLimit: state.game.timeLimit,
  currentUser: state.users.currentUser || {},
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onStartGame: startGame,
  onLogoutUser: logoutUser,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Game));
