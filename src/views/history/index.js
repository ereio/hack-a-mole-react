import React, {
  useEffect, useState, useMemo, useCallback
} from 'react';
import moment from 'moment';

// redux
import { useDispatch, useSelector } from 'react-redux';

// react router
import { useHistory, withRouter } from 'react-router-dom';

// actions
import { logoutUser } from '../../store/auth/actions';
import { fetchGames, selectGame } from '../../store/game/actions';

// global components
import { FiSettings, FiChevronLeft } from 'react-icons/fi';
import { Panel, TouchableButton } from '../components';

import { ReactComponent as EmptyHole } from '../../global/assets/empty-hole.svg';
import { ReactComponent as MoleHole } from '../../global/assets/mole-hole.svg';

import './styles.css';

export const History = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [highlight, setHighlight] = useState(null);

  const games = useSelector((state) => state.game.games, []);
  const users = useSelector((state) => state.users.users, []);
  const currentUser = useSelector((state) => state.users.currentUser);

  useEffect(() => {
    dispatch(fetchGames());
  }, []);

  const onSelectGame = (gameId) => {
    dispatch(selectGame(gameId));
    history.push('/review');
  };

  const onGoBack = () => {
    history.goBack();
  };

  const onLogoutUser = () => {
    dispatch(logoutUser());
  };

  const renderGames = () => {
    const allGames = Object.values(games).map((game) => {
      const { score } = game;
      const { username } = users[game.userId];

      const dateOptions = {
        month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric',
      };
      const dateFormatter = Intl.DateTimeFormat('en-US', dateOptions);
      const dateString = dateFormatter.format(new Date(game.endTime)); // 'MMMM D, YYYY h:mma'


      return (
        <li
          key={game.id}
          onClick={() => onSelectGame(game)}
          onKeyPress={() => onSelectGame(game)}
          onMouseEnter={() => setHighlight(game.id)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 8,
            cursor: 'pointer',
          }}>
          {highlight === game.id
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
              {username || 'Unknown'}
            </div>
            <div style={{ fontSize: 20, marginRight: 24 }}>
              {`Score ${score}`}
            </div>
            <div style={{ fontSize: 16, marginBottom: 2 }}>
              {dateString}
            </div>
          </div>
        </li>);
    });

    return (
      <ul style={{ flex: 1 }}>
        {allGames}
      </ul>
    );
  };


  return (
    <Panel>
      <div className="container-stats">
        <div className="settings">
          <TouchableButton start onClick={onGoBack}>
            <FiChevronLeft />
          </TouchableButton>
        </div>
        <span className="message">
          History
        </span>
        <div className="settings">
          <TouchableButton end onClick={onLogoutUser}>
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
        {renderGames()}
      </div>
      <div className="container-info" />
    </Panel>
  );
};