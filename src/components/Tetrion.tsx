import { useSelector } from "react-redux";
import { RootState } from "../store";
import styles from './Tetrion.module.css'
import { TILE_COLOR } from "../consts/tetrominos";
import { SpriteLayer } from "./SpriteLayer";
import { Matrix } from "./Matrix";

export const Tetrion: React.FC = () => {
    const dispatcherState = useSelector((state: RootState) => state.dispatcher)
    const matrixState = useSelector((state: RootState) => state.matrix)
    return (
        <div className={styles['tetrion']}>
            <SpriteLayer />
            <Matrix />
        </div>
    )
}