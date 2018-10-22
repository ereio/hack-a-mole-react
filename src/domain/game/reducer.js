import * as types from './actions';

// libs
import moment from 'moment';

const initialState = {
    isActive: false,
    isStarted: false,
    startTime: 0,
    endTime: 0,
    rows: ["A", "B", "C"],
    holes: ["1", "2", "3"],
    score: 0,
    moles: [],
};

export default function game(state = initialState, action = {}) {
    switch (action.type) {
        case types.START_GAME:
            return {
                ...state,
                isStarted: true,
                startTime: moment(),
                endTime: moment().addl(1, 'minute')
            }
        case types.START_GAME_FINISHED:
            return {
                ...state,
                isActive: true,
            }
        case types.END_GAME:
            return {
                ...state,
                isStarted: false,
                startTime: 0,
                endTime: 0,
            }
        case types.END_GAME_FINISHED:
            return {
                ...state,
                isActive: false,
            }
        case types.WHACK_MOLE:
            const whackedMoles = state.moles.filter((mole) => {
                return mole.cell !== action.mole.cell;
            });
            return {
                ...state,
                moles: whackedMoles
            }
        case types.SPAWN_MOLE:
            const spawnedMoles = [...state.moles, action.mole]
            return {
                ...state,
                moles: spawnedMoles
            }
        case types.DESPAWN_MOLE:
            const despawnedMoles = state.moles.filter((mole) => {
                return mole.cell !== action.mole.cell;
            });
            return {
                ...state,
                moles: despawnedMoles
            }
        default:
            return state;
    }
}