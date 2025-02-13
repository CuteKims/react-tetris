import { TetrionControl } from "./consts/control";
import { GameLoop, GameSettings } from "./gameLoop";
import { KeyboardInputHandler } from "./keyboardInputHandler";

export type GameMode = 'zen' | '40_lines'

export class GameTetrion {
    public gameLoop: GameLoop | null
    private keyboardInputHandler: KeyboardInputHandler
    
    constructor() {
        this.gameLoop = null
        this.keyboardInputHandler = new KeyboardInputHandler()
    }

    public initializeGame(mode: GameMode) {
        const gameSettings: GameSettings = {
            matrixColumns: 10,
            bagRandomizerType: '7-bag'
        }
        
        switch (mode) {
            case 'zen':
                this.gameLoop = new GameLoop(gameSettings, () => this.keyboardInputHandler.pull())
                break;
            case "40_lines":
                this.gameLoop = new GameLoop(gameSettings, () => this.keyboardInputHandler.pull())
                break;
        }
    }

    public getKeyboardEventListeners() {
        return this.keyboardInputHandler.getListeners()
    }

    public testInsertToQueue(control: TetrionControl) {
        this.keyboardInputHandler.testInsertToQueue(control)
    }

    public endGame() {
        this.gameLoop = null
    }
}