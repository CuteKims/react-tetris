import { MouseEventHandler, useContext, useEffect } from 'react'
import { TETROMINO_COLOR } from '../../game/consts/tetrominos'
import styles from './MainMenu.module.css'
import { AppPage, globalAppContext } from '../../App'

export const MainMenu: React.FC = () => {
    const {navigate, tetrion} = useContext(globalAppContext)
    useEffect(() => {
        tetrion.endGame()
    }, [])
    return (
        <div id={styles['main-menu']}>
            <div id={styles['button-container']}>
                <div>
                    <SquareButton
                        text='禅模式'
                        backgroundColor={TETROMINO_COLOR['S']}
                        textColor='white'
                        onClick={() => {
                            tetrion.initializeGame('zen')
                            navigate(AppPage.Tetrion)
                        }}
                    />
                    <SquareButton
                        text='40行<br>挑战'
                        backgroundColor={TETROMINO_COLOR['L']}
                        textColor='white'
                        onClick={() => {
                            tetrion.initializeGame('40_lines')
                            navigate(AppPage.Tetrion)
                        }}
                    />
                    <SquareButton
                        text='设置'
                        backgroundColor={TETROMINO_COLOR['I']}
                        textColor='white'
                        onClick={() => navigate(AppPage.Settings)}
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