
import moment from 'moment';
import gql from 'graphql-tag';
import { v4 as uuidv4 } from 'uuid';


import { apiClient } from '../../global/api';
import { addAlert } from '../alerts/actions';

export const SET_LOADING = 'SET_LOADING';
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
 * State Management
 *
 * The following actions call the remote calls above or
 * manage just the local state
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
 * Save Game
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveGame = ({ score }) => async (dispatch, getState) => {
  console.log('[saveGame]', score);
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const { currentGame } = getState().game;
    const { startTime, endTime } = currentGame;
    const response = await apiClient.mutate({
      mutation: gql`
        mutation saveGame($game: GameInput!) {
          saveGame(game: $game){
            id
            score
            endTime
            startTime
          }
        }
      `,
      variables: {
        game: {
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
  console.log('[saveMoleSpawn]', mole);
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const response = await apiClient.mutate({
      mutation: gql`
        mutation saveMoleSpawn($spawn: SpawnInput!) {
          saveMoleSpawn(spawn: $spawn)
        }
      `,
      variables: {
        spawn: {
          moleId: mole.id,
          gameId: game.id,
          cell: mole.cell,
          despawn: false,
          timestamp: moment().format(),
        },
      },
    });

    dispatch({
      type: SET_CURRENT_GAME,
      game: response.data.saveGame,
    });

    console.log(response);
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
  console.log('[saveMoleDespawn]', mole);
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const response = await apiClient.mutate({
      mutation: gql`
        mutation saveMoleSpawn($spawn: SpawnInput!) {
          saveMoleSpawn(spawn: $spawn)
        }
      `,
      variables: {
        spawn: {
          moleId: mole.id,
          gameId: game.id,
          cell: mole.cell,
          despawn: true,
          timestamp: moment().format(),
        },
      },
    });

    console.log(response);
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
  console.log('[saveWhackHit]', mole);
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const response = await apiClient.mutate({
      mutation: gql`
        mutation saveMoleWhack($spawn: SpawnInput!) {
          saveMoleWhack(spawn: $spawn)
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

    console.log(response);
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
  console.log('[saveWhackAttempt]', mole);
  try {
    dispatch({ type: SET_LOADING, loading: true });

    const game = getState().game.currentGame;

    const response = await apiClient.mutate({
      mutation: gql`
        mutation saveMoleWhack($spawn: SpawnInput!) {
          saveMoleWhack(spawn: $spawn)
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


    console.log(response);
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

export const whackMole = (cell) => (dispatch, getState) => {
  console.log('[ACTION whackMole]', cell);

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
  console.log('[ACTION spawnMole]', foundMole);

  if (!foundMole.length) {
    const mole = { id: uuidv4(), cell };
    dispatch({ type: SPAWN_MOLE, mole });
    dispatch(saveMoleSpawn(mole));
  }
};

export const despawnMole = (cell) => (dispatch, getState) => {
  const { moles } = getState().game;
  const foundMole = moles.find((mole) => mole.cell === cell);

  console.log('[ACTION despawnMole]', foundMole);
  if (foundMole) {
    dispatch({ type: DESPAWN_MOLE, mole: foundMole });
    dispatch(saveMoleDespawn(foundMole));
  }
};
