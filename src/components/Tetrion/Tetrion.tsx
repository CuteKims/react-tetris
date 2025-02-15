import styles from './Tetrion.module.css'
import { Matrix } from "./Matrix/Matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useTickLoop } from "../../utils/useTickLoop";
import { globalAppContext } from '../../App';
import { MatrixState } from '../../game/gameMatrix';
import { HoldState, TetrominoState } from '../../game/gameLoop';
import { TetrominoType } from '../../game/consts/tetrominos';

export type TetrionState = {
    matrixState: MatrixState,
    tetrominoState: TetrominoState,
    holdState: HoldState,
    preview: TetrominoType[]
    inEntryDelay: boolean
}

export const Tetrion: React.FC = () => {
    const {tetrion} = useContext(globalAppContext)
    
    //绑定键盘事件
    useEffect(() => {
        let {keyDownListener, keyUpListener} = tetrion.getKeyboardEventListeners()
        document.addEventListener('keydown', keyDownListener)
        document.addEventListener('keyup', keyUpListener)
        return () => {
            document.removeEventListener('keydown', keyDownListener)
            document.removeEventListener('keyup', keyUpListener)
        }
    }, [])

    // Tick循环
    const [tetrionState, updateTetrionState] = useState<TetrionState | undefined>(tetrion.gameLoop?.getState())

    const {start, stop} = useTickLoop(() => {
        tetrion.gameLoop?.tick()
        updateTetrionState(tetrion.gameLoop?.getState())
        tickCountRef.current++
    }, 1000 / 60)

    useEffect(() => {
        start()
        return () => stop()
    }, [])

    // TPS (Ticks per second) 统计
    let tickCountRef = useRef<number>(0)
    const [tickrate, updateTickrate] = useState(0)

    useEffect(() => {
        let id = setInterval(() => {
            updateTickrate(tickCountRef.current)
            tickCountRef.current = 0
        }, 1000);
        return () => {
            clearInterval(id)
        }
    }, [])

    return (
        <div id={styles['tetrion']}>
            <Matrix tetrionState={tetrionState}/>
            <p style={{position: 'absolute', top: '0px', right: '0px'}}>{`TPS: ${tickrate}`}</p>
        </div>
    )
}