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

    this.renderMenu = this.renderMenu.bind(this);

    this.onClickReady = this.onClickReady.bind(this);
  }

  componentWillUnmount() {
    const { onLogoutUser } = this.props;
    onLogoutUser();
  }

  onClickReady() {
    const { onStartGame } = this.props;
    onStartGame();
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
            onClick={() => history.push('/leaderboard')}
          />
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="review gameplay"
            disabled={isStarted}
            onClick={() => history.push('/review')}
          />
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="start game"
            disabled={isStarted}
            onClick={this.onClickReady}
          />
        </div>
      </div>
    );
  }

  render() {
    const { isStarted, endTime, score } = this.props.game;
    const { email } = this.props.user.current;

    return (
      <div className="game">
        <div className="container-stats">
          <div className="score">
            {`Score: ${score}`}
          </div>
          {isStarted ? (
            <div className="time">
              {`Time: ${moment(endTime).diff(moment(), 'seconds')}`}
            </div>
          ) : (
            <span className="message">
              {`Welcome ${email}`}
            </span>
          ) }
          <div className="settings">
            <TouchableButton end onClick={() => {}}>
              <FiSettings />
            </TouchableButton>
          </div>
        </div>
        <div className="container-game-board">
          {isStarted ? <Board /> : this.renderMenu() }
        </div>
        <div className="container-info" />
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
