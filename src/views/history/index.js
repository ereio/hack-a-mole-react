import React, { Component } from 'react';
import moment from 'moment';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// react router
import { withRouter } from 'react-router-dom';

// actions
import { logoutUser } from '../../store/auth/actions';
import { fetchGames, selectGame } from '../../store/game/actions';


// global components
import { FiSettings, FiChevronLeft } from 'react-icons/fi';
import { TouchableButton } from '../../global/components';

import { ReactComponent as EmptyHole } from '../../global/assets/empty-hole.svg';
import { ReactComponent as MoleHole } from '../../global/assets/mole-hole.svg';

import './styles.css';

class History extends Component {
  constructor() {
    super();

    this.state = {
      highlight: null,
    };

    this.onGoBack = this.onGoBack.bind(this);
    this.renderGames = this.renderGames.bind(this);
    this.onSelectGame = this.onSelectGame.bind(this);
  }

  componentDidMount() {
    const { onFetchAllGames } = this.props;
    onFetchAllGames();
  }

  onSelectGame(gameId) {
    const { onSelectGame, history } = this.props;
    onSelectGame(gameId);
    history.push('/review');
  }

  onGoBack() {
    const { history } = this.props;
    history.goBack();
  }

  renderGames() {
    const { games = [], users } = this.props;
    const { highlight } = this.state;
    return (
      <ul style={{ flex: 1 }}>
        {games.map((game) => (
          <li
            key={game.id}
            onClick={() => this.onSelectGame(game)}
            onKeyPress={() => this.onSelectGame(game)}
            onMouseEnter={() => this.setState({ highlight: game.id })}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              marginTop: 8,
              marginBottom: 8,
              cursor: 'pointer',
            }}>
            { highlight === game.id
              ? (
                <MoleHole style={{
                  width: 48,
                  height: 48,
                  borderRadius: 56,
                  marginRight: 24,
                  marginBottom: 8,
                }} />
              )
              : (
                <EmptyHole style={{
                  width: 48,
                  height: 48,
                  borderRadius: 56,
                  marginRight: 24,
                  marginBottom: 8,
                }} />
              )}
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'flex-end',
            }}>
              <div style={{ fontSize: 20, marginRight: 24 }}>
                {users[game.userId] || 'Unknown'}
              </div>
              <div style={{ fontSize: 20, marginRight: 24 }}>
                {`Score ${game.score}`}
              </div>
              <div style={{ fontSize: 16, marginBottom: 2 }}>
                {moment(game.endTime).format('MMMM D, YYYY h:mma')}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { onLogoutUser, currentUser } = this.props;

    return (
      <div className="game">
        <div className="container-stats">
          <div className="settings">
            <TouchableButton
              start
              onClick={this.onGoBack}>
              <FiChevronLeft />
            </TouchableButton>
          </div>
          <span className="message">
            History
          </span>
          <div className="settings">
            <TouchableButton
              end
              onClick={() => onLogoutUser()}>
              <FiSettings />
            </TouchableButton>
          </div>
        </div>
        <div style={{
          flexDirection: 'row',
          height: '100%',
          width: '100%',
          overflow: 'auto',
        }}>
          {this.renderGames()}
        </div>
        <div className="container-info" />
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  games: state.game.games,
  users: state.users.users,
  currentUser: state.users.currentUser || {},
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onLogoutUser: logoutUser,
  onSelectGame: selectGame,
  onFetchAllGames: fetchGames,
}, dispatch);

// no actions needed yet at app layer
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(History));
