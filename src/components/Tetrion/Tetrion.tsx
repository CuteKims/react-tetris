import styles from './Tetrion.module.css'
import { Matrix } from "./Matrix/Matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useTickLoop } from "../../utils/useTickLoop";
import { globalAppContext } from '../../App';
import { MatrixState } from '../../game/gameMatrix';
import { HoldState, TetrominoState } from '../../game/gameLoop';
import { TetrominoType } from '../../game/consts/tetrominos';
import { useSearchParams } from 'react-router';
import { GameMode } from '../../game/gameTetrion';
import { KeyboardInputHandler } from '../../game/keyboardInputHandler';

export type TetrionState = {
    matrixState: MatrixState,
    tetrominoState: TetrominoState,
    holdState: HoldState,
    preview: TetrominoType[]
    inEntryDelay: boolean
}

export const Tetrion: React.FC = () => {
    const {tetrion} = useContext(globalAppContext)
    const [params] = useSearchParams()
    const gameLoop = useRef(tetrion.initializeGame(params.get('mode') as GameMode)).current
    const inputHandler = useRef(new KeyboardInputHandler()).current
    const [tetrionState, updateTetrionState] = useState<TetrionState | undefined>()
    let tickCountRef = useRef<number>(0)
    const [tickrate, updateTickrate] = useState(0)
    
    const {start, stop} = useTickLoop(() => {
        updateTetrionState(gameLoop.tick(inputHandler.pull()))
        tickCountRef.current++
    }, 1000 / 60)

    useEffect(() => {
        let {keyDownListener, keyUpListener} = inputHandler.getListeners()
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)
        let id = setInterval(() => {
            updateTickrate(tickCountRef.current)
            tickCountRef.current = 0
        }, 1000);
        start()
        return () => {
            document.removeEventListener('keydown', keyDownListener)
            document.removeEventListener('keyup', keyUpListener)
            clearInterval(id)
            stop()
        }
    }, [])

    return (
        <div id={styles['tetrion']}>
            <Matrix tetrionState={tetrionState}/>
            <p style={{position: 'absolute', top: '0px', right: '0px'}}>{`TPS: ${tickrate}`}</p>
        </div>
    )
}