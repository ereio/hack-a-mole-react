
import moment from 'moment';

export const START_GAME = 'START_GAME';
export const START_GAME_FINISHED = 'START_GAME_FINISHED';

export const END_GAME = 'END_GAME';
export const END_GAME_FINISHED = 'END_GAME_FINISHED';

export const INCREMENT_SCORE = 'INCREMENT_SCORE';

export const WHACK_MOLE = 'MOLE_WHACKED';
export const DESPAWN_MOLE = 'MOLE_DESPAWN';
export const SPAWN_MOLE = 'MOLE_SPAWN';


/**
 * Create Game
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const createGame = ({ score, startTime, endTime }) => (dispatch) => {
  console.log('[createGame]', score, startTime, endTime);
};


/**
 * Save Game
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveGame = ({ score, startTime, endTime }) => (dispatch) => {
  console.log('[saveGame]', score, startTime, endTime);
};


/**
 * Save Mole Spawn
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveMoleSpawn = (mole) => (dispatch) => {
  console.log('[saveMoleSpawn]', mole);
};


/**
 * Save Mole Despawn
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveMoleDespawn = (mole) => (dispatch) => {
  console.log('[saveMoleDespawn]', mole, moment().format());
};

/**
 * Save Mole Whack
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveMoleWhack = ({ mole, timestamp }) => (dispatch) => {
  console.log('[saveMoleWhack]', mole, timestamp);
};

/**
 * Save Whack Attempt (generic on press)
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveWhackAttempt = ({ mole, timestamp, event }) => (dispatch) => {
  console.log('[saveWhackAttempt]', event);
};


/**
 *
 * State Management
 *
 * The following actions call the remote calls above or
 * manage just the local state
 *
 */
export const startGame = () => (dispatch) => {
  dispatch({
    type: START_GAME,
  });
};

export const endGame = () => async (dispatch, getState) => {
  const { score, startTime, endTime } = getState().game;
  dispatch({ type: END_GAME });
  await dispatch(saveGame({ score, startTime, endTime }));
  dispatch({ type: END_GAME_FINISHED });
};

export const whackMole = (cell) => (dispatch, getState) => {
  const { moles } = getState().game;
  if (moles.find((mole) => mole.cell === cell)) {
    dispatch({ type: INCREMENT_SCORE });
  }

  const mole = { cell };
  dispatch({ type: WHACK_MOLE, mole });
  dispatch(saveMoleWhack(mole));
};

export const spawnMole = (cell) => (dispatch) => {
  const mole = { cell };
  dispatch({ type: SPAWN_MOLE, mole });
  dispatch(saveMoleSpawn(mole));
};

export const despawnMole = (cell) => (dispatch) => {
  const mole = { cell };
  dispatch({ type: DESPAWN_MOLE, mole });
  dispatch(saveMoleDespawn(mole));
};
