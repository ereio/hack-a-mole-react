
export const START_GAME = 'START_GAME';
export const START_GAME_FINISHED = 'START_GAME_FINISHED';

export const END_GAME = 'END_GAME';
export const END_GAME_FINISHED = 'END_GAME_FINISHED';

export const INCREMENT_SCORE = "INCREMENT_SCORE";

export const WHACK_MOLE = "MOLE_WHACKED";
export const DESPAWN_MOLE = "MOLE_DESPAWN"
export const SPAWN_MOLE = "MOLE_SPAWN";

export const startGame = () => {
    return (dispatch) => {
        dispatch({
            type: START_GAME,
        })
    }
}

export const endGame = () => {
    return (dispatch) => {
        dispatch({
            type: END_GAME,
        })
    }
}

export const whackMole = (cell) => {
    return (dispatch, getState) => {
        const { moles } = getState().game 
        if (moles.find((mole) => mole.cell === cell)) {
            dispatch({
                type: INCREMENT_SCORE,
            })
        }
        const mole = {
            cell
        }
        dispatch({
            type: WHACK_MOLE,
            mole,
        })
    }
}

export const spawnMole = (cell) => {
    return (dispatch) => {
        const mole = {
            cell
        }
        dispatch({
            type: SPAWN_MOLE,
            mole,
        })
    }
}

export const despawnMole = (cell) => {
    return (dispatch) => {
        const mole = {
            cell
        }
        dispatch({
            type: DESPAWN_MOLE,
            mole
        })
    }
}
