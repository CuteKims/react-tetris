import { produce } from "immer";
import { BagRandomizer, BagRandomizerType } from "./bagRandomizer";
import { TetrionControl } from "./consts/control";
import { TetrominoType } from "./consts/tetrominos";
import { ROTATION_SEQUENCE, TetrominoOrientation, WALL_KICK_TABLE } from "./consts/wallKickTable";
import { GameMatrix, MatrixState } from "./gameMatrix";

export type GameSettings = {
    matrixColumns: number,
    bagRandomizerType: BagRandomizerType
}

export type TetrionState = {
    matrixState: MatrixState,
    tetrominoState: TetrominoState,
    holdState: HoldState,
    inEntryDelay: boolean
}

export type TetrominoState = {
    type: TetrominoType
    position: [number, number]
    orientation: TetrominoOrientation
}

export type HoldState = {
    type: TetrominoType | 'empty',
    flag: boolean
}

export class GameLoop {
    private pullInput: () => TetrionControl[]

    private matrix: GameMatrix
    private bagRandomizer: BagRandomizer

    private holdState: HoldState = {
        type: 'empty',
        flag: false
    }
    private tetrominoState: TetrominoState
    
    private gravity: number
    private lockDelayCounter: number = 30
    private lockDelayResetCounter: number = 15
    private entryDelay: number = 0

    constructor(gameSettings: GameSettings, pullInput: () => TetrionControl[]) {
        let bagRandomizer = new BagRandomizer(gameSettings.bagRandomizerType)
        let tetrominoType = bagRandomizer.getNext()

        this.pullInput = pullInput
        
        this.matrix = new GameMatrix(gameSettings.matrixColumns)
        this.bagRandomizer = bagRandomizer

        this.tetrominoState = {
            type: tetrominoType,
            position: [22, 0],
            orientation: '0'
        }

        this.gravity = 1 / 60
    }



    public tick() {
        if(this.entryDelay !== 0) {
            return
        }

        if(this.lockDelayCounter === 0 || this.lockDelayResetCounter === 0) {
            this.matrix.lock(this.tetrominoState)
            this.matrix.clear()
            this.nextPiece()
        }

        if(!this.matrix.checkCollision(produce(this.tetrominoState, draft => {draft.position[0] -= 1}))) {
            this.lockDelayCounter -= 1
        }
        
        for(let control of this.pullInput()) {
            switch (control) {
                case TetrionControl.Hold: {
                    this.switchHold()
                    break
                }
                case TetrionControl.MoveLeft: {
                    if(this.matrix.checkCollision(produce(this.tetrominoState, draft => {draft.position[1] -= 1}))) {
                        this.tetrominoState.position[1] -= 1
                    }
                    break
                }
                case TetrionControl.MoveRight: {
                    if(this.matrix.checkCollision(produce(this.tetrominoState, draft => {draft.position[1] += 1}))) {
                        this.tetrominoState.position[1] += 1
                    }
                    break
                }
                case TetrionControl.RotateClockwise: {
                    this.rotate('clockwise')
                    break
                }
                case TetrionControl.RotateCounterClockwise: {
                    this.rotate('counter_clockwise')
                    break
                }
                case TetrionControl.SoftDrop: {
                    if(this.matrix.checkCollision(produce(this.tetrominoState, draft => {draft.position[0] -= 1}))) {
                        this.tetrominoState.position[0] -= 1
                    }
                    break
                }
                case TetrionControl.HardDrop: {
                    for (let offset = 0;;offset++) {
                        if(!this.matrix.checkCollision(produce(this.tetrominoState, draft => {draft.position[0] -= offset}))) {
                            this.matrix.lock(produce(this.tetrominoState, draft => {draft.position[0] -= offset - 1}))
                            this.matrix.clear()
                            this.nextPiece()
                            break
                        }
                    }
                    break
                }
            }
        }
    }

    private rotate(direction: 'clockwise' | 'counter_clockwise') {
        let newOrientation = ROTATION_SEQUENCE[(ROTATION_SEQUENCE.indexOf(this.tetrominoState.orientation) + (direction === 'clockwise' ? 1 : 3)) % 4]
        
        let wallKickTable = WALL_KICK_TABLE[this.tetrominoState.type][`${this.tetrominoState.orientation}${newOrientation}`]

        for(let testOffset of wallKickTable) {
            if(this.matrix.checkCollision(produce(this.tetrominoState, draft => {
                draft.orientation = newOrientation
                draft.position[0] += testOffset[0]
                draft.position[1] += testOffset[1]
            }))) {
                this.tetrominoState.orientation = newOrientation
                this.tetrominoState.position[0] += testOffset[0]
                this.tetrominoState.position[1] += testOffset[1]
                this.lockDelayCounter = 30
                this.lockDelayResetCounter -= 1
                break
            }
        }
    }

    private nextPiece() {
        this.lockDelayCounter = 30
        this.lockDelayResetCounter = 15
        this.tetrominoState.type = this.bagRandomizer.getNext()
        this.tetrominoState.position = [22, 0]
        this.tetrominoState.orientation = '0'
    }

    public getState(): TetrionState {
        return {
            matrixState: this.matrix.getState(),
            tetrominoState: this.tetrominoState,
            holdState: this.holdState,
            inEntryDelay: this.entryDelay !== 0
        }
    }

    private switchHold(): boolean {
        // TODO
        return false
    }
}