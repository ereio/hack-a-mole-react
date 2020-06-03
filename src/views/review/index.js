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
import { FiSettings, FiChevronLeft } from 'react-icons/fi';
import { MaterialButton } from 'global/components/material/button';
import { TouchableButton } from 'global/components/material/touchable';


// local components
import ReviewBoard from './review-board';

import './styles.css';

class Review extends Component {
  constructor() {
    super();

    this.state = {
      timeLeft: 0,
    };

    this.renderGame = this.renderGame.bind(this);
    this.renderReviewMenu = this.renderReviewMenu.bind(this);

    this.onStartReview = this.onStartReview.bind(this);
  }

  async componentDidMount() {
    const { onFetchGameplay } = this.props;
    await onFetchGameplay();
  }

  async onStartReview() {
    const { onStartReview } = this.props;
    const { timeLimit } = this.state;

    this.setState({ timeLeft: timeLimit - 1 });

    await onStartReview();

    const { endTime } = this.props.game;

    const timer = setInterval(() => {
      const timeLeft = moment(endTime).diff(moment(), 'seconds');
      this.setState({ timeLeft });
      if (timeLeft <= 0) {
        clearInterval(timer);
      }
    }, 250);
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
      return <ReviewBoard />;
    }

    return this.renderReviewMenu();
  }

  render() {
    const { isStarted, score } = this.props.game;
    const { onLogoutUser, history } = this.props;
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
            : (
              <div className="settings">
                <TouchableButton start onClick={() => history.goBack()}>
                  <FiChevronLeft />
                </TouchableButton>
              </div>
            )}
          {isStarted ? (
            <div className="time">
              {`Time: ${timeLeft}`}
            </div>
          ) : (
            <span className="message">
              Review Game
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
  currentUser: state.users.currentUser || {},
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onLogoutUser: logoutUser,
  onStartReview: startReview,
  onFetchGameplay: fetchGameplay,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Review));
