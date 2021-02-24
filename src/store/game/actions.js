
import moment from 'moment';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';

import { apiClient } from 'global/api';
import { addAlert } from '../alerts/actions';

export const SET_REVIEW = 'SET_REVIEW';
export const SET_LOADING = 'SET_LOADING';
export const SET_ALL_GAMES = 'SET_ALL_GAMES';
export const SET_CURRENT_GAME = 'SET_CURRENT_GAME';

export const START_GAME = 'START_GAME';
export const START_GAME_FINISHED = 'START_GAME_FINISHED';

export const END_GAME = 'END_GAME';
export const END_GAME_FINISHED = 'END_GAME_FINISHED';

export const INCREMENT_SCORE = 'INCREMENT_SCORE';

export const WHACK_MOLE = 'MOLE_WHACKED';
export const DESPAWN_MOLE = 'MOLE_DESPAWN';
export const SPAWN_MOLE = 'MOLE_SPAWN';

/**
 *
 * Fetch Games
 *
 * Begin the game but also create a game
 * remotely to save events under
 *
 */
export const fetchGames = () => async (dispatch, getState) => {
  try {
    const userId = getState().auth.user.uid;

    console.log('[fetchGames]', userId);

    dispatch({ type: SET_LOADING, loading: true });

    const { data } = await apiClient.query({
      query: gql`
        query games($userId: ID!) {
          games(userId: $userId){
            id
            userId
            score
            endTime
            startTime
          }
        }
      `,
      variables: {
        userId,
      },
    });

    dispatch({
      type: SET_ALL_GAMES,
      games: data.games,
    });

    const { games } = getState().games;
    const { users } = getState().users;

    games.forEach((game) => {
      if (users[game.userId]) {
        console.log('[fetchGames[', game.userId);
      }
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'createGame',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};


/**
 * Create Game
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const createGame = ({ startTime, endTime }) => async (dispatch) => {
  console.log('[createGame]', startTime, endTime);

  try {
    dispatch({ type: SET_LOADING, loading: true });
    const response = await apiClient.mutate({
      mutation: gql`
        mutation createGame($game: GameInput!) {
          createGame(game: $game){
            id
            startTime
            endTime
          }
        }
      `,
      variables: {
        game: {
          score: 0,
          endTime,
          startTime,
        },
      },
    });

    console.log('[createGame]', response);
    dispatch({
      type: SET_CURRENT_GAME,
      game: response.data.createGame,
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'createGame',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};

/**
 *
 * Start Game
 *
 * Begin the game but also create a game
 * remotely to save events under
 *
 */
export const startGame = () => async (dispatch, getState) => {
  const timelimit = getState().game.timeLimit;
  const startTime = moment().format();
  const endTime = moment().add(timelimit, 'seconds').format();

  const newGame = {
    endTime,
    startTime,
  };

  dispatch(
    createGame(newGame),
  );

  dispatch({
    type: START_GAME,
    game: newGame,
  });
};


/**
 * Save Game
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveGame = ({ score }) => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const { currentGame } = getState().game;
    const { startTime, endTime } = currentGame;
    const response = await apiClient.mutate({
      mutation: gql`
        mutation updateGame($game: GameInput!) {
          updateGame(game: $game){
            id
            score
            endTime
            startTime
          }
        }
      `,
      variables: {
        game: {
          id: currentGame.id,
          score,
          endTime,
          startTime,
        },
      },
    });

    dispatch({
      type: SET_CURRENT_GAME,
      game: response.data.saveGame,
    });

    console.log('[saveGame]', response);
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'saveGame',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};


export const endGame = () => async (dispatch, getState) => {
  const { score, startTime, endTime } = getState().game;
  dispatch({ type: END_GAME });
  await dispatch(saveGame({ score, startTime, endTime }));
  dispatch({ type: END_GAME_FINISHED });
};


/**
 * Save Mole Spawn
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveMoleSpawn = (mole) => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const timestamp = moment().toISOString();
    console.log('[saveMoleSpawn]', timestamp);

    await apiClient.mutate({
      mutation: gql`
        mutation saveMoleSpawn($spawn: SpawnInput!) {
          saveMoleSpawn(spawn: $spawn){
            id
            moleId
            despawn
          }
        }
      `,
      variables: {
        spawn: {
          moleId: mole.id,
          gameId: game.id,
          cell: mole.cell,
          despawn: false,
          timestamp,
        },
      },
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'saveMoleSpawn',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};


/**
 * Save Mole Despawn
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveMoleDespawn = (mole) => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const timestamp = moment().toISOString();
    console.log('[saveMoleSpawn]', timestamp);

    await apiClient.mutate({
      mutation: gql`
        mutation saveMoleSpawn($spawn: SpawnInput!) {
          saveMoleSpawn(spawn: $spawn){
            id
            moleId
            despawn
          }
        }
      `,
      variables: {
        spawn: {
          moleId: mole.id,
          gameId: game.id,
          cell: mole.cell,
          despawn: true,
          timestamp,
        },
      },
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'saveMoleDespawn',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};

/**
 * Save Mole Whack
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveWhackHit = (mole) => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const { data } = await apiClient.mutate({
      mutation: gql`
        mutation saveMoleWhack($whack: WhackInput!) {
          saveMoleWhack(whack: $whack){
            id
            moleId
            hit
          }
        }
      `,
      variables: {
        whack: {
          moleId: mole.id,
          gameId: game.id,
          cell: mole.cell,
          hit: true,
          timestamp: moment().format(),
        },
      },
    });

    console.log('[saveWhackHit]', data.saveMoleWhack);
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'saveWhackHit',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};


/**
 * Save Whack Attempt (generic on press)
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveWhackAttempt = (mole) => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const { data } = await apiClient.mutate({
      mutation: gql`
        mutation saveMoleWhack($whack: WhackInput!) {
          saveMoleWhack(whack: $whack){
            id
            moleId
            hit
          }
        }
      `,
      variables: {
        whack: {
          moleId: mole.id,
          gameId: game.id,
          cell: mole.cell,
          hit: false,
          timestamp: moment().format(),
        },
      },
    });

    console.log('[saveWhackAttempt]', data.saveMoleWhack);
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'saveWhackAttempt',
    }));
  } finally {
    dispatch({ type: SET_LOADING, loading: false });
  }
};

/**
 * Whack Mole
 *
 */
export const whackMole = (cell) => (dispatch, getState) => {
  const { moles } = getState().game;
  if (moles.find((mole) => mole.cell === cell)) {
    const whackedMole = moles.find((mole) => mole.cell === cell);
    dispatch({ type: INCREMENT_SCORE });
    dispatch(saveWhackHit(whackedMole));
  } else {
    dispatch(saveWhackAttempt({ cell }));
  }

  dispatch({ type: WHACK_MOLE, mole: { cell } });
};


export const spawnMole = (cell) => (dispatch, getState) => {
  const { moles } = getState().game;
  const foundMole = moles.filter((mole) => mole.cell === cell);

  if (!foundMole.length) {
    const mole = { id: uuidv4(), cell };
    dispatch({ type: SPAWN_MOLE, mole });
    dispatch(saveMoleSpawn(mole));
  }
};

export const despawnMole = (cell) => (dispatch, getState) => {
  const { moles } = getState().game;
  const foundMole = moles.find((mole) => mole.cell === cell);

  if (foundMole) {
    dispatch({ type: DESPAWN_MOLE, mole: foundMole });
    dispatch(saveMoleDespawn(foundMole));
  }
};


export const fetchGameplay = () => async (dispatch, getState) => {
  try {
    const { currentGame } = getState().game;

    const { data } = await apiClient.query({
      query: gql`
      query gameplay($gameId: ID) {
        gameplay(gameId: $gameId){  
          ... on Spawn {
            id
            gameId 
            moleId 
            cell 
            timestamp 
            despawn 
          }
          ... on Whack {
            id
            gameId 
            moleId 
            cell 
            timestamp 
            hit 
          }
        }
      }
    `,
      variables: {
        gameId: currentGame.id,
      },
    });

    dispatch({
      type: SET_REVIEW,
      events: data.gameplay,
    });
  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'fetchGameplay',
    }));
  }
};

/**
 *
 * Select Game
 *
 * Begin the game but also create a game
 * remotely to save events under
 *
 */
export const selectGame = (game) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_GAME,
    game,
  });
};

/**
 *
 * Start Review
 *
 * Begin the game but also create a game
 * remotely to save events under
 *
 */
export const startReview = () => async (dispatch, getState) => {
  const {
    id,
    endTime,
    startTime,
    events,
  } = getState().game.currentGame;

  const timelimit = moment(endTime).diff(moment(startTime), 'seconds');
  const virtualStartTime = moment();
  const virtualEndTime = moment().add(timelimit, 'seconds');

  const elapsedEvents = events.map((event) => ({
    ...event,
    elapsed: moment(event.timestamp).diff(moment(startTime)),
  }));

  console.log(
    '[startReview]',
    id,
    timelimit,
    virtualStartTime.format(),
    virtualEndTime.format(),
    elapsedEvents,
  );


  console.log('[startReview] beginning review');
  let nextEventIndex = 0;

  const virtualGame = {
    startTime: virtualStartTime,
    endTime: virtualEndTime,
  };


  dispatch({ type: START_GAME, game: virtualGame });
  dispatch({ type: START_GAME_FINISHED });

  const virtualTime = setInterval(() => {
    const delta = virtualEndTime.diff(moment());
    const elapsed = (timelimit * 1000) - delta;

    if (delta < 0) {
      console.log('[startReview] ending review');
      clearInterval(virtualTime);
    }

    if (elapsedEvents.length - 1 <= nextEventIndex) {
      dispatch({ type: END_GAME });
      dispatch({ type: END_GAME_FINISHED });
      return;
    }

    const nextEvent = elapsedEvents[nextEventIndex];

    if (nextEvent.elapsed < elapsed) {
      // eslint-disable-next-line
      switch (nextEvent.__typename) {
        case 'Spawn':
          if (!nextEvent.despawn) {
            dispatch({ type: SPAWN_MOLE, mole: nextEvent });
            console.log('[startReview] spawn', nextEvent);
          } else {
            dispatch({ type: DESPAWN_MOLE, mole: nextEvent });
            console.log('[startReview] despawn', nextEvent);
          }
          break;
        case 'Whack':
        default:
          if (nextEvent.hit) {
            dispatch({ type: INCREMENT_SCORE });
            dispatch({ type: WHACK_MOLE, mole: nextEvent });
            console.log('[startReview] hit', nextEvent);
          } else {
            dispatch({ type: WHACK_MOLE, mole: nextEvent });
            console.log('[startReview] miss', nextEvent);
          }
          break;
      }
      nextEventIndex += 1;
    }
  }, 10);
};
