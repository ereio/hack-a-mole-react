
export const START_GAME = 'START_GAME';
export const START_GAME_FINISHED = 'START_GAME_FINISHED';

export const END_GAME = 'END_GAME';
export const END_GAME_FINISHED = 'END_GAME_FINISHED';

export const INCREMENT_SCORE = 'INCREMENT_SCORE';

export const WHACK_MOLE = 'MOLE_WHACKED';
export const DESPAWN_MOLE = 'MOLE_DESPAWN';
export const SPAWN_MOLE = 'MOLE_SPAWN';

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
 * Save Score
 *
 * This will purposefully call the api to save the game
 * action at once, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveScore = (score) => (dispatch) => {
  console.log('[saveScore]', score);
};

/**
 * Save Spawned Mole
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveSpawnedMole = (mole) => (dispatch) => {
  console.log('[saveSpawnedMole]', mole);
};

/**
 * Save Despawned Mole
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveDespawnedMole = (mole) => (dispatch) => {
  console.log('[saveDespawnedMole]', mole);
};

/**
 * Save Whack Attempt (generic on press)
 *
 * This will purposefully call the api to save
 * mole spawn positions, this is so we can have a high
 * (and inefficient) throughput of requests
 */
export const saveWhackAttempt = (event) => (dispatch) => {
  console.log('[saveWhackAttempt]', event);
};


export const startGame = () => (dispatch) => {
  dispatch({
    type: START_GAME,
  });
};

export const endGame = () => (dispatch) => {
  dispatch({ type: END_GAME });
  dispatch(saveScore());
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
  dispatch(saveSpawnedMole(mole));
};

export const despawnMole = (cell) => (dispatch) => {
  const mole = { cell };
  dispatch({ type: DESPAWN_MOLE, mole });
  dispatch(saveDespawnedMole(mole));
};
