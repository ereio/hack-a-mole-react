import React, { Component } from 'react';
import moment from 'moment';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import { logoutUser } from 'store/auth/actions';
import { fetchGames } from 'store/game/actions';


// global components
import { FiSettings } from 'react-icons/fi';
import { TouchableButton } from 'global/components/material/touchable';


import './styles.css';

class History extends Component {
  constructor() {
    super();

    this.renderGames = this.renderGames.bind(this);
    this.onSelectGame = this.onSelectGame.bind(this);
  }

  componentDidMount() {
    const { onFetchAllGames } = this.props;
    onFetchAllGames();
  }

  onSelectGame() {
    const { onStartReview } = this.props;
    onStartReview();
  }


  renderGames() {
    const { allGames } = this.props;
    return allGames.map((game) => (
      <div key={game.id}>
        {game.id}
      </div>
    ));
  }

  render() {
    const { onLogoutUser, currentUser } = this.props;

    return (
      <div className="game">
        <div className="container-stats">
          <div className="score" />
          <span className="message">
            {`Welcome ${currentUser.username}`}
          </span>
          <div className="settings">
            <TouchableButton end onClick={() => onLogoutUser()}>
              <FiSettings />
            </TouchableButton>
          </div>
        </div>
        <div className="container-game-board">
          {this.renderGames()}
        </div>
        <div className="container-info" />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  allGames: state.game.allGames,
  currentUser: state.user.currentUser || {},
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onLogoutUser: logoutUser,
  onFetchAllGames: fetchGames,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(History));
