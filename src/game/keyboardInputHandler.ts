import { TetrionControl } from "./consts/control"

export type KeyMapping = {
    [K in TetrionControl]: string | null
}

const DEFAULT_KEY_MAPPING: KeyMapping = {
    [TetrionControl.Hold]: "ShiftLeft",
    [TetrionControl.MoveLeft]: "ArrowLeft",
    [TetrionControl.MoveRight]: "ArrowRight",
    [TetrionControl.RotateClockwise]: "ArrowUp",
    [TetrionControl.RotateCounterClockwise]: null,
    [TetrionControl.SoftDrop]: "ArrowDown",
    [TetrionControl.HardDrop]: "Space"
}

type KeyState = {
    hold: boolean,
    delayedAutoShiftCounter: number,
    autoRepeatRateCounter: number,
}

const INITIAL_KEY_STATE: KeyState = {
    hold: false,
    delayedAutoShiftCounter: 10,
    autoRepeatRateCounter: 2
}

type KeyboardEventListener = (ev: KeyboardEvent) => void

export class KeyboardInputHandler {
    private queue: TetrionControl[] = []
    private keyMapping = (() => {
        let result: {[K: string]: string} = {}
        for (let key in DEFAULT_KEY_MAPPING) {
            //@ts-ignore
            result[DEFAULT_KEY_MAPPING[key]] = key
        }
        return result
    })()
    private keyStates = {
        [TetrionControl.MoveLeft]: structuredClone(INITIAL_KEY_STATE),
        [TetrionControl.MoveRight]: structuredClone(INITIAL_KEY_STATE),
        [TetrionControl.SoftDrop]: structuredClone(INITIAL_KEY_STATE)
    }

    constructor() {}

    public getListeners(): {
        keyDownListener: KeyboardEventListener,
        keyUpListener: KeyboardEventListener
    } {
        let keyDownListener = (ev: KeyboardEvent) => this.handleKeyboardEvent('keydown', ev)
        let keyUpListener = (ev: KeyboardEvent) => this.handleKeyboardEvent('keyup', ev)
        return {
            keyDownListener,
            keyUpListener
        }
    }

    /**
     * Pull the TetrionControl queue. Calling this method would also clear its internal queue.
     * 
     * This method is bounded to tick updates internally, so it should be called on every tick.
     */
    public pull() {
        let result: TetrionControl[] = []

        Object.entries(this.keyStates).forEach(([key, state]) => {
            if(!state.hold) return
            if(state.delayedAutoShiftCounter !== 0) {
                state.delayedAutoShiftCounter -= 1
                return
            }
            if(state.autoRepeatRateCounter !== 0) {
                state.autoRepeatRateCounter -= 1
                return
            }
            //@ts-ignore
            result.push(key)
            state.autoRepeatRateCounter = 2
        })

        result.push(...this.queue)
        
        this.queue = []
        return result
    }

    public testInsertToQueue(control: TetrionControl) {
        this.queue.push(control)
    }

    private handleKeyboardEvent(type: 'keydown' | 'keyup', ev: KeyboardEvent) {
        if(ev.repeat) return
        switch (this.keyMapping[ev.code]) {
            case TetrionControl.MoveLeft: {
                if(type === 'keydown') {
                    this.queue.push(TetrionControl.MoveLeft)
                    this.keyStates[TetrionControl.MoveLeft].hold = true
                } else {
                    this.keyStates[TetrionControl.MoveLeft].hold = false
                    this.keyStates[TetrionControl.MoveLeft].delayedAutoShiftCounter = 10
                }
                break
            }
            case TetrionControl.MoveRight: {
                if(type === 'keydown') {
                    this.queue.push(TetrionControl.MoveRight)
                    this.keyStates[TetrionControl.MoveRight].hold = true
                } else {
                    this.keyStates[TetrionControl.MoveRight].hold = false
                    this.keyStates[TetrionControl.MoveRight].delayedAutoShiftCounter = 10
                }
                break
            }
            case TetrionControl.SoftDrop: {
                if(type === 'keydown') {
                    this.queue.push(TetrionControl.SoftDrop)
                    this.keyStates[TetrionControl.SoftDrop].hold = true
                } else {
                    this.keyStates[TetrionControl.SoftDrop].hold = false
                    this.keyStates[TetrionControl.SoftDrop].delayedAutoShiftCounter = 10
                }
                break
            }
            case TetrionControl.HardDrop: {
                if(type === 'keydown') this.queue.push(TetrionControl.HardDrop)
                break
            }
            case TetrionControl.RotateClockwise: {
                if(type === 'keydown') this.queue.push(TetrionControl.RotateClockwise)
                break
            }
            case TetrionControl.RotateCounterClockwise: {
                if(type === 'keydown') this.queue.push(TetrionControl.RotateCounterClockwise)
                break
            }
            case TetrionControl.Hold: {
                if(type === 'keydown') this.queue.push(TetrionControl.Hold)
                break
            }
        }
    }
}