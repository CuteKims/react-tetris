import styles from './Matrix.module.css'
import { TETROMINO_COLOR, TETROMINO_SHAPE } from '../../../game/consts/tetrominos'
import { TetrionState } from '../../../game/gameLoop'

export const Matrix: React.FC<{tetrionState?: TetrionState}> = ({tetrionState}) => {
    return (
        <div id={styles['matrix-container']}>
            {(() => {
                if(tetrionState) {
                    return (
                        <>
                            <div id={styles['buffer-zone']}>
                                {tetrionState.matrixState.slice(20, 40).toReversed().map((row, index) => {
                                    return (
                                        <div key={index} className={styles['row']}>
                                            {row.map((tile, index) => {
                                                if(tile.type === 'empty') {
                                                    return <div key={index} className={styles['tile']} />
                                                }
                                                else return <div key={index} className={styles['tile']} style={{backgroundColor: TETROMINO_COLOR[tile.type]}}/>
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                            <div id={styles['matrix']}>
                                {tetrionState.matrixState.slice(0, 20).toReversed().map((row, index) => {
                                    return (
                                        <div key={index} className={styles['row']}>
                                            {row.map((tile, index) => {
                                                if(tile.type === 'empty') {
                                                    return <div key={index} className={styles['tile']} style={{backgroundColor: 'rgba(127, 127, 127, .5)'}} />
                                                }
                                                else return <div key={index} className={styles['tile']} style={{backgroundColor: TETROMINO_COLOR[tile.type]}}/>
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                            {tetrionState.inEntryDelay ? null : (
                                <div id={styles['active-tetromino']} style={{top: `${-(Math.floor(tetrionState.tetrominoState.position[0]) - 19) * 20}px`, left: `${tetrionState.tetrominoState.position[1] * 20}px`}}>
                                    {TETROMINO_SHAPE[tetrionState.tetrominoState.type][tetrionState.tetrominoState.orientation].map((row, index) => {
                                        return (
                                            <div key={index} className={styles['row']}>
                                                {row.map((tile, index) => {
                                                    if(tile === 1) return <div key={index} className={styles['tile']} style={{backgroundColor: TETROMINO_COLOR[tetrionState.tetrominoState.type]}} />
                                                    else return <div key={index} className={styles['tile']} />
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </>
                    )
                } else {
                    return (
                        <p>Something went wrong.</p>
                    )
                }
            })()}
        </div>
    )
}