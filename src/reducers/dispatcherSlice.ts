import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TetrominoType } from "../consts/tetrominos";
import { BagRandomizer, BagRandomizerType } from "../utils/bagRandomizer";

export type DispatcherState = {
    bagRandomizer: BagRandomizer,
    currentPiece: TetrominoType,
    previewQueue: TetrominoType[],
    hold: {
        type: TetrominoType | null,
        flag: boolean
    }
} | null

// const initialDispatcherState: (columns: number) => DispatcherState = (columns) => {
//     let [currentPiece, bagRandomizer] = BagRandomizer.initialize().next()
//     return {
//         bagRandomizer,
//         currentPiece,
//         previewQueue: bagRandomizer.getPreview(5),
//         hold: {
//             type: null,
//             flag: false
//         }
//     }
// }

type DispatcherOptions = {
    bagRandomizerType: BagRandomizerType
}

export const dispatcherSlice = createSlice({
    name: 'dispatcher',
    initialState: null as DispatcherState,
    reducers: {
        initialize: (state, action: PayloadAction<DispatcherOptions>) => {
            let [currentPiece, bagRandomizer] = BagRandomizer.initialize(action.payload.bagRandomizerType).next()
            state = {
                bagRandomizer,
                currentPiece,
                previewQueue: bagRandomizer.getPreview(5),
                hold: {
                    type: null,
                    flag: false
                }
            }
        },
        nextPiece: (state) => {
            if(state === null) {
                throw new Error('Game uninitialized.')
            }
            let [piece, newRandomizer] = state.bagRandomizer.next()
            state.currentPiece = piece
            state.bagRandomizer = newRandomizer
            state.previewQueue = newRandomizer.getPreview(5)

            state.hold.flag = false
        },
        hold: (state) => {
            if(state === null) {
                throw new Error('Game uninitialized.')
            }
            if (state.hold.type === null) {
                state.hold.type = state.currentPiece
                
                let [piece, newRandomizer] = state.bagRandomizer.next()
                state.currentPiece = piece
                state.bagRandomizer = newRandomizer
                state.previewQueue = newRandomizer.getPreview(5)

                state.hold.flag = true
            } else if(state.hold.flag === false) {
                let swap = state.currentPiece
                state.currentPiece = state.hold.type
                state.hold.type = swap

                state.hold.flag = true
            }
        }
    }
})

export const { nextPiece } = dispatcherSlice.actions

export default dispatcherSlice.reducer