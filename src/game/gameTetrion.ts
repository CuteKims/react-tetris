import { GameLoop, GameSettings } from "./gameLoop";

export type GameMode = 'zen' | '40_lines'

export class GameTetrion {
    constructor() {}

    public initializeGame(mode: GameMode): GameLoop {
        const gameSettings: GameSettings = {
            matrixColumns: 10,
            bagRandomizerType: '7-bag'
        }

        switch (mode) {
            case 'zen':
                //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions
                return new GameLoop(gameSettings)
            case "40_lines":
                return new GameLoop(gameSettings)
            default: throw new Error(`Unexpected initialization paramater: expected 'zen' or '40_lines', got '${mode}'`)
        }
    }
}