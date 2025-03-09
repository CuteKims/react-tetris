import './App.css'
import { MainMenu } from './components/MainMenu/MainMenu'
import { DeveloperOverlay } from './components/DeveloperOverlay/DeveloperOverlay'
import { createContext, useRef } from 'react'
import { GameTetrion } from './game/gameTetrion'
import { Tetrion } from './components/Tetrion/Tetrion'
import { BrowserRouter, Route, Routes } from 'react-router'

export enum AppPage {
    MainMenu = 'main_menu',
    Tetrion = 'tetrion',
    Settings = 'settings',
    About = 'about'
}

export const globalAppContext = createContext<{
    tetrion: GameTetrion
//@ts-ignore
}>(null)

function App() {
    let tetrion = useRef(new GameTetrion()).current
    return (
        <globalAppContext.Provider value={{tetrion}}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<MainMenu />} />
                    <Route path='game' element={<Tetrion />} />
                    <Route path='settings' element={<></>} />
                    <Route path='about' element={<></>} />
                </Routes>
            </BrowserRouter>
            <DeveloperOverlay />
        </globalAppContext.Provider>
    )
}

export default App