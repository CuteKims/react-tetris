import styles from './Matrix.module.css'
import { TETROMINO_COLOR, TETROMINO_COLOR_RGB, TETROMINO_SHAPE, TetrominoType } from '../../../game/consts/tetrominos'
import { TetrionState } from '../Tetrion'
import { TetrominoState } from '../../../game/gameLoop'
import { type MutableRefObject, useEffect, useRef } from 'react'

const Tile: React.FC<{type: TetrominoType | 'garbage' | 'empty' | 'placeholder', shadow?: boolean}> = ({type, shadow}) => {
    // let color: string
    // let boxShadow = ''
    // switch (type) {
    //     case 'empty':
    //         color = 'rgba(127, 127, 127, .16)'
    //         break;
    //     case 'placeholder':
    //         color = 'transparent'
    //         break
    //     default:
    //         color = TETROMINO_COLOR[type]
    //         let rgbColor = TETROMINO_COLOR_RGB[type]
    //         boxShadow = `0px 0px 6px rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}, .16)`
    //         break;
    // }
    return (
        <div className={styles['tile']} data-tetromino-type={type} data-tetromino-shadow={shadow} /> 
    )
}

const Tetromino: React.FC<{tetrominoState: TetrominoState}> = ({tetrominoState}) => (
    <div id={styles['active-tetromino']} style={{top: `${-(Math.floor(tetrominoState.position[0]) - 19) * 20}px`, left: `${tetrominoState.position[1] * 20}px`}}>
        {TETROMINO_SHAPE[tetrominoState.type][tetrominoState.orientation].map((row, index) => (
            <div key={index} className={styles['row']}>
                {row.map((tile, index) => {
                    if(tile === 1) {
                        return <Tile key={index} type={tetrominoState.type} />
                    }
                    else {
                        return <Tile key={index} type='placeholder' />
                    }
                })}
            </div>
        ))}
    </div>
)

const Preview: React.FC<{queue: TetrominoType[]}> = ({queue}) => (
    <div id={styles['preview-container']}>
        <h1>Next</h1>
        <div id={styles['preview']}>
            {queue.map((tetromino, index) => (
                <>
                    {index === 0 ? null : <hr />}
                    <div className={styles['preview-tetromino-container']}>
                        <div className={styles['preview-tetromino']}>
                            {TETROMINO_SHAPE[tetromino]['0'].map((row, index) => {
                                if(row.every(value => value === 0)) return
                                return (
                                    <div key={index} className={styles['row']}>
                                        {row.map((tile, index) => {
                                            if(tile === 1) return <Tile key={index} type={tetromino} />
                                            else return <Tile key={index} type='placeholder' />
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </>
            ))}
        </div>
    </div>
)

const Hold: React.FC<{tetrominoType: TetrominoType | 'empty', isLocked: boolean}> = ({tetrominoType, isLocked}) => (
    <div id={styles['hold-container']}>
        <h1>Hold</h1>
        <div id={styles['hold']}>
            {tetrominoType === 'empty' ? null : (
                <div className={styles['preview-tetromino']}>
                    {TETROMINO_SHAPE[tetrominoType]['0'].map((row, index) => {
                        if(row.every(value => value === 0)) return
                        return (
                            <div key={index} className={styles['row']}>
                                {row.map((tile, index) => {
                                    if(tile === 1) return <Tile key={index} type={isLocked ? 'garbage' : tetrominoType} />
                                    else return <Tile key={index} type='placeholder' />
                                })}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    </div>
)

export const Matrix: React.FC<{tetrionState?: TetrionState}> = ({tetrionState}) => {
    let matrix;
    if (tetrionState) {
        const selectedColumns = new Set;
        if (!tetrionState.inEntryDelay) {
            const tetrominoState = tetrionState.tetrominoState
            TETROMINO_SHAPE[tetrominoState.type][tetrominoState.orientation].forEach((row) => {
                row.forEach((tile, index) => {
                    if (tile === 1) {
                        selectedColumns.add(tetrominoState.position[1] + index)
                    }
                })
            })
        }

        const tetromino = tetrionState.inEntryDelay ? null : <Tetromino tetrominoState={tetrionState.tetrominoState} />
        
        matrix = (
            <>
                <div id={styles['matrix-background']} />
                <div id={styles['buffer-zone']}>
                    {tetrionState.matrixState.slice(20, 40).toReversed().map((row, index) => (
                        <div key={index} className={styles['row']}>
                            {row.map((tile, index) => {
                                if(tile.type === 'empty') {
                                    return <Tile key={index} type='placeholder' />
                                }
                                else return <Tile key={index} type={tile.type} />
                            })}
                        </div>
                    ))}
                </div>
                <div id={styles['matrix']}>
                    {tetrionState.matrixState.slice(0, 20).toReversed().map((row, index) => (
                        <div key={index} className={styles['row']}>
                            {row.map((tile, index) => {
                                if(tile.type === 'empty') {
                                    return <Tile key={index} type='empty' shadow={selectedColumns.has(index)} />
                                }
                                else return <Tile key={index} type={tile.type} />
                            })}
                        </div>
                    ))}
                </div>
                <Preview queue={tetrionState.preview}/>
                <Hold tetrominoType={tetrionState.holdState.type} isLocked={tetrionState.holdState.isLocked}/>
                {tetromino}
            </>
        )
    } else {
        matrix = <p>Something went wrong.</p>
    }
    return (<div id={styles['matrix-container']}>
        {matrix}
    </div>)
}