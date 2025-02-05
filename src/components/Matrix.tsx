import { useSelector } from 'react-redux'
import styles from './Matrix.module.css'
import { RootState } from '../store'
import { TILE_COLOR } from '../consts/tetrominos'

export const Matrix: React.FC = () => {
    const matrixState = useSelector((state: RootState) => state.matrix)
    return (
        <div className={styles['matrix-container']}>
            <div className={styles['buffer-zone']}>
                {/* FIXME: Should only render matrix when game is initialized. */}
                {matrixState.matrix.slice(20, 40).reverse().map((row, index) => {
                    return (
                        <div key={index} className={styles['row']}>
                            {row.map(({tileType}, index) => {
                                if(tileType === null) {
                                    return <div key={index} className={styles['tile']} />
                                }
                                else return <div key={index} className={styles['tile']} style={{backgroundColor: TILE_COLOR[tileType]}}/>
                            })}
                        </div>
                    )
                })}
            </div>
            <div className={styles['matrix']}>
                {matrixState.matrix.slice(0, 20).reverse().map((row, index) => {
                    return (
                        <div key={index} className={styles['row']}>
                            {row.map(({tileType}, index) => {
                                if(tileType === null) {
                                    return <div key={index} className={styles['tile']} style={{backgroundColor: 'rgba(127, 127, 127, .5)'}} />
                                }
                                else return <div key={index} className={styles['tile']} style={{backgroundColor: TILE_COLOR[tileType]}}/>
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
        
    )
}