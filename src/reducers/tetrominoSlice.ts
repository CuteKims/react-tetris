import { createSlice, Dispatch, UnknownAction } from "@reduxjs/toolkit"
import { TetrominoType } from "../consts/tetrominos"
import { TetrominoOrientation } from "../consts/wallKickTable"

export type TetrominoState = {
    position: [number, number]
    orientation: TetrominoOrientation
} | null

const tetrominoSlice = createSlice({
    name: 'tetromino',
    initialState: null as TetrominoState,
    reducers: {
        
    }
})

export const {} = tetrominoSlice.actions

export default tetrominoSlice.reducer