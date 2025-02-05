import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Tetrion } from './components/Tetrion'
import { useDispatch } from 'react-redux'

function App() {
    const [count, setCount] = useState(0)
    const dispatch = useDispatch()

    return (
        <>
            <Tetrion />
        </>
    )
}

export default App