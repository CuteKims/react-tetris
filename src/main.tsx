import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { MainMenu } from './components/MainMenu/MainMenu.tsx'
import { Tetrion } from './components/Tetrion/Tetrion.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
)