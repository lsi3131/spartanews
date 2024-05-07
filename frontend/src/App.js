import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Components/Navbar/Navbar'
import LoginForm from './Components/LoginForm/LoginForm'
import HomeForm from './Components/HomeForm/HomeForm'
import WriteForm from './Components/WriteForm/WriteForm'
import { jwtDecode } from 'jwt-decode'

function App() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('accessToken')

        if (token) {
            try {
                const decoded = jwtDecode(token)
                setUser(decoded.username)
                console.log('토큰 해석 결과:', decoded)
            } catch (error) {
                console.error('토큰 해석 중 에러 발생:', error)
            }
        }
    }, [])

    return (
        <div>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomeForm />} />
                    <Route path="/write" element={<WriteForm />} />
                    <Route path="/login" element={<LoginForm />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
