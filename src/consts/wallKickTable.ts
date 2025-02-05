export type TetrominoOrientation = '0' | 'R' | '2' | 'L'

type WallKickRotates = `${TetrominoOrientation}${TetrominoOrientation}`

type WallKickTable = {
    [K in WallKickRotates]?: [number, number][]
}

const WALL_KICK_TABLE = {
    
}