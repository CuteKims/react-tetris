import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface GameState {
    status: GameStatus
    settings: GameSettings | null,
}

enum GameStatus {
    Idle = 'idle',
    Running = 'running'
}

type GameSettings = {
    mode: '40_lines',
} | {
    mode: 'zen',
    customs: {
        columns: number,
        gravity: number
    }
} | {
    mode: 'endless',
    customs: {
        startLevel: number
    }
}

const initialState: GameState = {
    status: GameStatus.Idle,
    settings: null
}

const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        startGame: (state, action: PayloadAction<GameSettings>) => {
            state.status = GameStatus.Running
            state.settings = action.payload
        },
        endGame: (state) => {
            state.status = GameStatus.Idle
            state.settings = null
        }
    }
})

export const { startGame, endGame } = gameSlice.actions

export default gameSlice.reducer