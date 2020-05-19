import moment from 'moment';
import * as types from './actions';

const initialState = {
  isActive: false,
  isStarted: false,
  isEnded: false,
  startTime: 0,
  endTime: 0,
  timeLimit: 10,
  rows: ['A', 'B', 'C'],
  holes: ['1', '2', '3'],
  score: 0,
  moles: [],
};

export default function game(state = initialState, action = {}) {
  switch (action.type) {
    case types.START_GAME:
      return {
        ...state,
        score: 0,
        isStarted: true,
        startTime: moment().format(),
        endTime: moment().add(state.timeLimit, 'seconds').format(),
      };
    case types.START_GAME_FINISHED:
      return {
        ...state,
        isActive: true,
      };
    case types.END_GAME:
      return {
        ...state,
        isStarted: false,
        isActive: false,
        isEnded: true,
        startTime: 0,
        endTime: 0,
      };
    case types.END_GAME_FINISHED:
      return {
        ...state,
        isActive: false,
      };
    case types.WHACK_MOLE: {
      const whackedMoles = state.moles.filter((mole) => mole.cell !== action.mole.cell);
      return {
        ...state,
        moles: whackedMoles,
      };
    }
    case types.SPAWN_MOLE: {
      const spawnedMoles = [...state.moles, action.mole];
      return {
        ...state,
        moles: spawnedMoles,
      };
    }
    case types.DESPAWN_MOLE: {
      const despawnedMoles = state.moles.filter((mole) => mole.cell !== action.mole.cell);
      return {
        ...state,
        moles: despawnedMoles,
      };
    }
    case types.INCREMENT_SCORE:
      return {
        ...state,
        score: state.score + 1,
      };
    default:
      return state;
  }
}
