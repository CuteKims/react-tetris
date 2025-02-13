import styles from './DeveloperOverlay.module.css'
import { useContext } from 'react'
import { AppPage, globalAppContext } from '../../App'
import { TetrionControl } from '../../game/consts/control'
/**
 * 开发工具组件。用于提供控件方便即时修改应用状态以用于各种测试。
 */
export const DeveloperOverlay: React.FC = () => {
    const {navigate, tetrion} = useContext(globalAppContext)
    return (
        <div id={styles['developer-overlay']}>
            <div style={{height: '40px', width: '100%', backgroundColor: 'rgba(127, 127, 127, .5)', display: 'flex', gap: '2px', pointerEvents: 'all'}}>
                <button onClick={() => {
                    navigate(AppPage.MainMenu)
                }}>
                    Back
                </button>
                <button onClick={() => {
                    tetrion.testInsertToQueue(TetrionControl.SoftDrop)
                }}>
                    SoftDrop
                </button>
                <button onClick={() => {
                    tetrion.testInsertToQueue(TetrionControl.HardDrop)
                }}>
                    HardDrop
                </button>
                <button onClick={() => {
                    tetrion.testInsertToQueue(TetrionControl.MoveLeft)
                }}>
                    MoveLeft
                </button>
                <button onClick={() => {
                    tetrion.testInsertToQueue(TetrionControl.MoveRight)
                }}>
                    MoveRight
                </button>
                <button onClick={() => {
                    tetrion.testInsertToQueue(TetrionControl.RotateClockwise)
                }}>
                    RotateClockwise
                </button>
            </div>
        </div>
        
    )
}

// const Test: React.FC = () => {
//     const [count, setCount] = useState(0)
//     const {start, stop} = useTickLoop(() => {
//         setCount(i => i + 1)
//     }, 1000 / 60)
//     useEffect(() => {
//         start()
//         return stop
//     }, [])

//     return (
//         <>
//             <button onClick={start}>
//                 start
//             </button>
//             <button onClick={stop}>
//                 stop
//             </button>
//             <p>{count}</p>
//         </>
//     )
// }