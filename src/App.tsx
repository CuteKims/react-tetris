import './App.css'
import { MainMenu } from './components/MainMenu/MainMenu'
import { DeveloperOverlay } from './components/DeveloperOverlay/DeveloperOverlay'
import { createContext, useEffect, useRef, useState } from 'react'
import { GameTetrion } from './game/gameTetrion'
import { Tetrion } from './components/Tetrion/Tetrion'

export enum AppPage {
    MainMenu = 'main_menu',
    Tetrion = 'tetrion',
    Settings = 'settings',
    About = 'about'
}

export const globalAppContext = createContext<{
    page: AppPage,
    navigate: React.Dispatch<React.SetStateAction<AppPage>>,
    tetrion: GameTetrion //@ts-ignore
}>(null)

function App() {
    const [page, navigate] = useState<AppPage>(AppPage.MainMenu)
    let tetrion = useRef(new GameTetrion()).current
    return (
        <globalAppContext.Provider value={{page, navigate, tetrion}}>
            {(() => {
                switch (page) {
                    case AppPage.MainMenu:
                        return <MainMenu />
                    case AppPage.Tetrion:
                        return <Tetrion />
                    case AppPage.Settings:
                        return <></>
                    case AppPage.About:
                        return <></>
                }
            })()}
            <DeveloperOverlay />
        </globalAppContext.Provider>
    )
}



export default App