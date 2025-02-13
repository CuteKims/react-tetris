import styles from './Tetrion.module.css'
import { Matrix } from "./Matrix/Matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { TetrionState } from "../../game/gameLoop";
import { useTickLoop } from "../../utils/useTickLoop";
import { globalAppContext } from '../../App';

export const Tetrion: React.FC = () => {
    const {tetrion} = useContext(globalAppContext)
    const [tetrionState, updateTetrionState] = useState<TetrionState | undefined>(tetrion.gameLoop?.getState())

    // Tick循环
    const {start, stop} = useTickLoop(() => {
        tetrion.gameLoop?.tick()
        updateTetrionState(tetrion.gameLoop?.getState())
        tickCountRef.current++
    }, 1000 / 60)

    useEffect(() => {
        start()
        return () => {
            stop()
            tetrion.endGame()
        }
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