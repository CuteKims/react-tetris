import { TETROMINO_SHAPE, TetrominoType } from "./consts/tetrominos";
import { TetrominoState } from "./gameLoop";

export type Tile = {
    type: TetrominoType | 'garbage' | 'empty'
}

// const types: TetrominoType[] = [TetrominoType.I, TetrominoType.O, TetrominoType.T, TetrominoType.S, TetrominoType.Z, TetrominoType.J, TetrominoType.L]

export type MatrixState = Tile[][]

export function debugMatrixStateToString(matrixState: MatrixState): string {
    let string = ''
    matrixState.toReversed().forEach(row => {
        row.forEach(tile => {
            if(tile.type === 'empty') {
                string += '_ '
                return
            }
            if(tile.type === 'garbage') {
                string += '* '
                return
            }
            string += `${tile.type} `
        })
        string += '\n'
    })
    return string
}

export class GameMatrix {
    private matrixState: MatrixState

    constructor(columns: number) {
        this.matrixState = GameMatrix.generateEmptyMatrix(columns)
    }

    public checkCollision(tetrominoState: TetrominoState): boolean {
        let shape = TETROMINO_SHAPE[tetrominoState.type][tetrominoState.orientation]
        for (let [tetrominoRowNumber, tetrominoRow] of shape.toReversed().entries()) {
            for (let [tetrominoColumnNumber, tetrominoTile] of tetrominoRow.entries()) {
                if(tetrominoTile === 1) {
                    let matrixRowNumber = tetrominoRowNumber + Math.floor(tetrominoState.position[0]) - shape.length + 1
                    let matrixColumnNumber = tetrominoColumnNumber + tetrominoState.position[1]

                    if(matrixRowNumber < 0 || matrixRowNumber > this.matrixState.length - 1 || matrixColumnNumber < 0 || matrixColumnNumber > this.matrixState[0].length - 1) return false
                    
                    let matrixTile = this.matrixState[matrixRowNumber][matrixColumnNumber]
                    
                    if(matrixTile.type !== 'empty') return false
                }
            }
        }
        return true
    }

    public lock(tetrominoState: TetrominoState) {
        // console.log(`Locking tetromino: ${JSON.stringify(tetrominoState)}`)
        let shape = TETROMINO_SHAPE[tetrominoState.type][tetrominoState.orientation]
        for (let [rowNumber, row] of shape.toReversed().entries()) {
            for (let [columnNumber, tile] of row.entries()) {
                if(tile === 1) {
                    this.matrixState[rowNumber + Math.floor(tetrominoState.position[0]) - shape.length + 1][columnNumber + tetrominoState.position[1]].type = tetrominoState.type
                }
            }
        }
        // console.log(`Tetromino locked. matrixState: \n${debugMatrixStateToString(this.matrixState)}`)
    }

    public getState(): MatrixState {
        return this.matrixState
    }

    public clear() {
        let filledRows: number[] = []
        
        outerLoop:
        for (let [rowNumber, row] of this.matrixState.entries()) {
            for (let tile of row) {
                if(tile.type == 'empty') continue outerLoop
            }
            filledRows.push(rowNumber)
        }

        if(filledRows.length === 0) return

        let chunks = []

        for (let [index, rowNumber] of filledRows.entries()) {
            if(rowNumber === 0) continue
            if(index <= 0) {chunks.push([0, rowNumber]); continue}
            if(filledRows[index - 1] + 1 === rowNumber) continue
            else chunks.push([filledRows[index - 1] + 1, rowNumber])
        }
        
        if(filledRows.slice(-1)[0] < 39) chunks.push([filledRows.slice(-1)[0] + 1, 40])

        let newMatrixState: MatrixState = []

        chunks.forEach(range => {
            newMatrixState.push(...this.matrixState.slice(range[0], range[1]))
        })

        if(newMatrixState.length < 40) {
            let line = []
            for (let j = 0; j < this.matrixState[0].length; j++) {
                line.push({type: 'empty'} as Tile)
            }
            newMatrixState.push(line)
            for (let i = 0; i < 40 - newMatrixState.length - 1; i++) {
                newMatrixState.push(structuredClone(line))
            }
        }

        this.matrixState = newMatrixState
    }

    public static generateEmptyMatrix(columns: number): MatrixState {
        let matrix: MatrixState = []

        // It seems that this is the fastest way to do it...
        // Author: Fachep
        let line = [];
        for (let j = 0; j < columns; j++) {
            line.push({type: 'empty'} as Tile)
        }
        matrix.push(line)
        
        for (let i = 0; i < 40 - 1; i++) {
            matrix.push(structuredClone(line))
        }

        return matrix
    }
}