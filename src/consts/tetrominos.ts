import { Orientation } from "./wallKickTable"

export enum TetrominoType {
    I = 'I',
    O = 'O',
    T = 'T',
    S = 'S',
    Z = 'Z',
    J = 'J',
    L = 'L'
}

type TetrominoShape = {
    [K in TetrominoType]: {
        [K in Orientation]: number[][]
    }
}

export const TETROMINO_SHAPE: TetrominoShape = {
    'I': {
        '0': [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        'R': [
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 0]
        ],
        'L': [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0]
        ],
        '2': [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0]
        ]
    },
    'O': {
        '0': [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        'R': [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        'L': [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ],
        '2': [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, 0, 0, 0]
        ]
    },
    'T': {
        '0': [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
        'R': [
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0],
        ],
        'L': [
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 0],
        ],
        '2': [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ]
    },
    'S': {
        '0': [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        'R': [
            [0, 1, 0],
            [0, 1, 1],
            [0, 0, 1]
        ],
        'L': [
            [1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]
        ],
        '2': [
            [0, 0, 0],
            [0, 1, 1],
            [1, 1, 0]
        ]
    },
    'Z': {
        '0': [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        'R': [
            [0, 0, 1],
            [0, 1, 1],
            [0, 1, 0]
        ],
        'L': [
            [0, 1, 0],
            [1, 1, 0],
            [1, 0, 0]
        ],
        '2': [
            [0, 0, 0],
            [1, 1, 0],
            [0, 1, 1]
        ]
    },
    'J': {
        '0': [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        'R': [
            [0, 1, 1],
            [0, 1, 0],
            [0, 1, 0]
        ],
        'L': [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0]
        ],
        '2': [
            [0, 0, 0],
            [1, 1, 1],
            [0, 0, 1]
        ]
    },
    'L': {
        '0': [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        'R': [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1]
        ],
        'L': [
            [1, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ],
        '2': [
            [0, 0, 0],
            [1, 1, 1],
            [1, 0, 0]
        ]
    }
}


export const TILE_COLOR: {
    [K in TetrominoType]: string
} & {
    'garbage': string
} = {
    'I': '#31C7EF',
    'O': '#F7D308',
    'T': '#AD4D9C',
    'S': '#42B642',
    'Z': '#EF2029',
    'J': '#5A65AD',
    'L': '#EF7921',
    'garbage': '#7F7F7F'
}