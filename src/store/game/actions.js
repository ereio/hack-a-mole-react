
import moment from 'moment';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';

import { apolloClient } from 'services/hack-a-mole';
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
    const { currentUser } = getState().users;

    console.log('[fetchGames]', currentUser);

    dispatch({ type: SET_LOADING, loading: true });

    const { data } = await apolloClient.query({
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
        userId: currentUser.id,
      },
    });

    dispatch({ type: SET_ALL_GAMES, games: data.games });

  } catch (error) {
    dispatch(addAlert({
      type: 'error',
      message: error.message,
      origin: 'fetchGames',
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
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const { data: { createGame }, errors } = await apolloClient.mutate({
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

    return createGame;
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
  const newGame = { endTime, startTime };
  const currentGame = await dispatch(createGame(newGame));

  dispatch({ type: START_GAME, currentGame: currentGame });
};


/**
 * Save Game
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveGame = () => async (dispatch, getState) => {
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const { currentGame, score } = getState().game;
    const { id, startTime, endTime } = currentGame;

    console.log(id, score, startTime, endTime);

    const { data: { updateGame }, errors } = await apolloClient.mutate({
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
          id,
          score,
          endTime,
          startTime,
        },
      },
    });

    dispatch({ type: SET_CURRENT_GAME, game: updateGame });

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
  dispatch({ type: END_GAME });
  await dispatch(saveGame());
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

    const { currentGame } = getState().game;

    const timestamp = moment().toISOString();

    await apolloClient.mutate({
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
          gameId: currentGame.id,
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

    const { currentGame: { id: gameId } } = getState().game;
    const { id: moleId, cell } = mole;

    const timestamp = moment().toISOString();

    await apolloClient.mutate({
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
          moleId: moleId,
          gameId: gameId,
          cell: cell,
          despawn: true,
          timestamp,
        },
      },
    });

    console.log('[saveMoleSpawn]', timestamp);

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

    const { data: { saveMoleWhack } } = await apolloClient.mutate({
      mutation: gql`
        mutation saveMoleWhack($whack: WhackInput!) {
          saveMoleWhack(whack: $whack){
            id
            hit
            cell
            moleId
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

    console.log('[saveWhackHit]', saveMoleWhack);
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

    const { currentGame } = getState().game;

    const { data } = await apolloClient.mutate({
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
          cell: mole.cell,
          gameId: currentGame.id,
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
  const whackedMole = moles.find((mole) => mole.cell === cell);

  // TODO: misses handled by "fullstory" handler in view
  if (whackedMole) {
    dispatch({ type: INCREMENT_SCORE });
    dispatch(saveWhackHit(whackedMole));
  } else {
    dispatch(saveWhackAttempt({ id: null, cell }));
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

    const { data } = await apolloClient.query({
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
  dispatch({ type: SET_CURRENT_GAME, game });
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

  dispatch({ type: START_GAME, currentGame: virtualGame });
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
