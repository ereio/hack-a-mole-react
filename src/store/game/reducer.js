
import * as types from './actions';

import { initialState } from './state';

export const game = (state = initialState(), action = {}) => {
  switch (action.type) {
    case types.SET_ALL_GAMES:
      return {
        ...state,
        games: action.games,
      };
    case types.SET_REVIEW: {
      const currentGame = {
        ...state.currentGame,
        events: action.events,
      };
      return {
        ...state,
        currentGame,
      };
    }
    case types.SET_CURRENT_GAME:
      return {
        ...state,
        currentGame: action.game,
      };
    case types.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    case types.START_GAME: {
      const { startTime, endTime } = action.game;

      return {
        ...state,
        score: 0,
        moles: [],
        isStarted: true,
        startTime,
        endTime,
      };
    }
    case types.START_GAME_FINISHED:
      return {
        ...state,
        isActive: true,
      };
    case types.END_GAME:
      return {
        ...state,
        loading: true,
      };
    case types.END_GAME_FINISHED:
      return {
        ...state,
        loading: false,
        isStarted: false,
        isActive: false,
        isEnded: true,
        startTime: 0,
        endTime: 0,
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
};
