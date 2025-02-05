import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TetrominoType } from '../consts/tetrominos'

export type Matrix = {
    tileType: TetrominoType | 'garbage' | null
}[][]

export type MatrixState = {
    matrix: Matrix
} | null

const generateMatrix: (columns: number) => Matrix = (columns) => {
    let matrix: Matrix = []
    for (let i = 0; i < 40; i++) {
        matrix.push([])
        for (let j = 0; j < columns; j++) {
            matrix[i].push({tileType: null})
        }
    }
    matrix[21][1] = {tileType: TetrominoType.O}
    return matrix
}

export const MatrixSlice = createSlice({
    name: 'matrix',
    initialState: null as MatrixState,
    reducers: {
        initilize: (state, action: PayloadAction<{columns: number}>) => {
            state = {
                matrix: generateMatrix(action.payload.columns)
            }
        },
        lineClear: (state, action: PayloadAction<{affectedRows: number[]}>) => {
            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes
            
            // detect rows that are filled
            if (state === null) {
                throw new Error('Game uninitialized.')
            }

            action.payload.affectedRows.forEach(value => {
                state.matrix[value].forEach(({tileType}) => {
                    tileType
                })
            })
        }
    },
})

// Action creators are generated for each case reducer function
export const { lineClear } = MatrixSlice.actions

export default MatrixSlice.reducer