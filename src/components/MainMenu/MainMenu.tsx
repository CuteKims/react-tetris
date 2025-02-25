import { MouseEventHandler, useContext, useEffect } from 'react'
import { TETROMINO_COLOR } from '../../game/consts/tetrominos'
import styles from './MainMenu.module.css'
import { AppPage, globalAppContext } from '../../App'
import { useNavigate } from 'react-router'

export const MainMenu: React.FC = () => {
    const {tetrion} = useContext(globalAppContext)
    const navigate = useNavigate()
    return (
        <div id={styles['main-menu']}>
            <div id={styles['button-container']}>
                <div>
                    <SquareButton
                        text='禅模式'
                        backgroundColor={TETROMINO_COLOR['S']}
                        textColor='white'
                        onClick={() => {
                            navigate('/game?mode=zen')
                        }}
                    />
                    <SquareButton
                        text='40行<br>挑战'
                        backgroundColor={TETROMINO_COLOR['L']}
                        textColor='white'
                        onClick={() => {
                            navigate('/game?mode=40_lines')
                        }}
                    />
                    <SquareButton
                        text='设置'
                        backgroundColor={TETROMINO_COLOR['I']}
                        textColor='white'
                        onClick={() => navigate('/settings')}
                    />
                </div>
                <div>
                    <SquareButton
                        text='关于'
                        backgroundColor='white'
                        textColor='#323232'
                        onClick={() => {}}
                    />
                </div>
            </div>
        </div>
    )
}

const SquareButton: React.FC<{
    text: string,
    backgroundColor: string,
    textColor: string,
    onClick: MouseEventHandler<HTMLButtonElement>
}> = ({text, backgroundColor, textColor, onClick}) => {
    return (
        <button style={{backgroundColor}} onClick={onClick}>
            <p style={{color: textColor}} dangerouslySetInnerHTML={{__html: text}}/>
        </button>
    )
}