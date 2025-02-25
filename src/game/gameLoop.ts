import { BagRandomizer, BagRandomizerType } from "./bagRandomizer";
import { TetrionControl } from "./consts/control";
import { TetrominoType } from "./consts/tetrominos";
import { ROTATION_SEQUENCE, TetrominoOrientation, WALL_KICK_TABLE } from "./consts/wallKickTable";
import { GameMatrix } from "./gameMatrix";
import { TetrionState } from "../components/Tetrion/Tetrion";

enum RotateDirection {
    Clockwise = 1,
    CounterClockwise = 3
}

export type GameSettings = {
    matrixColumns: number,
    bagRandomizerType: BagRandomizerType
}

export type TetrominoState = {
    type: TetrominoType
    position: [number, number]
    orientation: TetrominoOrientation
}

export type HoldState = {
    type: TetrominoType | 'empty',
    isLocked: boolean
}

export class GameLoop {
    private matrix: GameMatrix
    private bagRandomizer: BagRandomizer

    private holdState: HoldState = {
        type: 'empty',
        isLocked: false
    }
    private tetrominoState: TetrominoState
    
    private gravity: number
    private lockDelayCount: number = 30
    private lockDelayResetCount: number = 15
    private entryDelay: number = 0

    constructor(gameSettings: GameSettings) {
        let bagRandomizer = new BagRandomizer(gameSettings.bagRandomizerType)
        let tetrominoType = bagRandomizer.getNext()

        this.matrix = new GameMatrix(gameSettings.matrixColumns)
        this.bagRandomizer = bagRandomizer

        this.tetrominoState = {
            type: tetrominoType,
            position: [22, 3],
            orientation: '0'
        }

        this.gravity = 1 / 60
    }

    public tick(inputs: TetrionControl[]): TetrionState {
        // enterDelay not implemented yet
        // if(this.entryDelay !== 0) {
        //     return
        // }

        if(this.lockDelayCount === 0 || this.lockDelayResetCount === 0) {
            this.matrix.lock(this.tetrominoState)
            this.matrix.clear()
            this.nextPiece()
        }

        this.tetrominoState.position[0] -= 1
        if(!this.matrix.checkCollision(this.tetrominoState)) {
            this.lockDelayCount -= 1
        } else {
            this.lockDelayCount = 30
            this.lockDelayResetCount = 15
            this.tetrominoState.position[0] -= this.gravity
        }
        this.tetrominoState.position[0] += 1
        
        for(let control of inputs) {
            switch (control) {
                case TetrionControl.Hold: {
                    this.switchHold()
                    break
                }
                case TetrionControl.MoveLeft: {
                    this.tetrominoState.position[1]--
                    if (this.matrix.checkCollision(this.tetrominoState)) {
                        this.lockDelayResetCount = 15
                    } else {
                        this.tetrominoState.position[1]++
                    }
                    break
                }
                case TetrionControl.MoveRight: {
                    
                    this.tetrominoState.position[1]++
                    if (this.matrix.checkCollision(this.tetrominoState)) {
                        this.lockDelayResetCount = 15
                    } else {
                        this.tetrominoState.position[1]--
                    }
                    break
                }
                case TetrionControl.RotateClockwise: {
                    this.rotate(RotateDirection.Clockwise)
                    break
                }
                case TetrionControl.RotateCounterClockwise: {
                    this.rotate(RotateDirection.CounterClockwise)
                    break
                }
                case TetrionControl.SoftDrop: {
                    this.tetrominoState.position[0]--
                    if (this.matrix.checkCollision(this.tetrominoState)) {
                        this.lockDelayResetCount = 15
                    } else {
                        this.tetrominoState.position[0]++
                    }
                    break
                }
                case TetrionControl.HardDrop: {
                    do {
                        this.tetrominoState.position[0] --
                    } while (this.matrix.checkCollision(this.tetrominoState));
                    this.tetrominoState.position[0] ++
                    this.matrix.lock(this.tetrominoState)
                    this.matrix.clear()
                    this.nextPiece()
                    // for (let testOffset = 0;;testOffset++) {
                    //     if(!this.matrix.checkCollision(produce(this.tetrominoState, draft => {draft.position[0] -= testOffset}))) {
                    //         this.tetrominoState.position[0] -= testOffset - 1
                    //         this.matrix.lock(this.tetrominoState)
                    //         this.matrix.clear()
                    //         this.nextPiece()
                    //         break
                    //     }
                    // }
                    break
                }
            }
        }

        return this.getState()
    }
    
    private rotate(direction: RotateDirection) {
        let newOrientation = ROTATION_SEQUENCE[(ROTATION_SEQUENCE.indexOf(this.tetrominoState.orientation) + direction) % 4]
        
        let wallKickTable = WALL_KICK_TABLE[this.tetrominoState.type][`${this.tetrominoState.orientation}${newOrientation}`]

        for(let testOffset of wallKickTable) {
            const testTetromino: TetrominoState = {
                type: this.tetrominoState.type,
                position: [
                    this.tetrominoState.position[0] + testOffset[0],
                    this.tetrominoState.position[1] + testOffset[1],
                ],
                orientation: newOrientation
            }
            if(this.matrix.checkCollision(testTetromino)) {
                this.tetrominoState = testTetromino
                this.lockDelayCount = 30
                this.lockDelayResetCount -= 1
                break
            }
        }
    }

    private switchHold() {
        if(this.holdState.type === 'empty') {
            this.holdState.type = this.tetrominoState.type
            this.tetrominoState.type = this.bagRandomizer.getNext()

            this.lockDelayCount = 30
            this.lockDelayResetCount = 15
            this.tetrominoState.position = [22, 3]
            this.tetrominoState.orientation = '0'

            this.holdState.isLocked = true
            return
        }
        if(!this.holdState.isLocked) {
            let stash = this.holdState.type
            this.holdState.type = this.tetrominoState.type
            this.tetrominoState.type = stash

            this.lockDelayCount = 30
            this.lockDelayResetCount = 15
            this.tetrominoState.position = [22, 3]
            this.tetrominoState.orientation = '0'

            this.holdState.isLocked = true
            return
        }
    }

    private nextPiece() {
        this.holdState.isLocked = false
        this.lockDelayCount = 30
        this.lockDelayResetCount = 15
        this.tetrominoState.type = this.bagRandomizer.getNext()
        this.tetrominoState.position = [22, 3]
        this.tetrominoState.orientation = '0'
    }

    private getState(): TetrionState {
        return {
            matrixState: this.matrix.getState(),
            tetrominoState: this.tetrominoState,
            holdState: this.holdState,
            inEntryDelay: this.entryDelay !== 0,
            preview: this.bagRandomizer.preview
        }
    }
}