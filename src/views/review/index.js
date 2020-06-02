import React, { Component } from 'react';
import moment from 'moment';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import { logoutUser } from 'store/auth/actions';
import { startReview, fetchGameplay } from 'store/game/actions';


// global components
import { FiSettings } from 'react-icons/fi';
import { MaterialButton } from 'global/components/material/button';
import { TouchableButton } from 'global/components/material/touchable';


// local components
import Board from './board';

import './styles.css';

class Review extends Component {
  constructor() {
    super();

    this.renderGame = this.renderGame.bind(this);
    this.renderReviewMenu = this.renderReviewMenu.bind(this);

    this.onStartReview = this.onStartReview.bind(this);
  }

  componentDidMount() {
    const { onFetchGameplay } = this.props;
    onFetchGameplay();
  }

  onStartReview() {
    const { onStartReview } = this.props;
    onStartReview();
  }

  renderReviewMenu() {
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
            buttonText="start playback"
            disabled={isStarted}
            onClick={this.onStartReview}
          />
        </div>
        <div style={{ marginTop: '24px', marginBottom: '24px' }}>
          <MaterialButton
            buttonText="main menu"
            disabled={isStarted}
            onClick={() => history.push('/game')}
          />
        </div>
      </div>
    );
  }

  renderGame() {
    const { isActive, isStarted } = this.props.game;
    if (isStarted || isActive) {
      return <Board />;
    }

    return this.renderReviewMenu();
  }

  render() {
    const { isStarted, endTime, score } = this.props.game;
    const { onLogoutUser, currentUser } = this.props;
    const timeLeft = moment(endTime).diff(moment(), 'seconds');

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
            <TouchableButton end onClick={() => onLogoutUser()}>
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
  currentUser: state.user.currentUser || {},
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onStartReview: startReview,
  onLogoutUser: logoutUser,
  onFetchGameplay: fetchGameplay,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));
