import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { useState, useEffect } from 'react'

import Navbar from './Components/Navbar/Navbar'
import LoginForm from './Components/LoginForm/LoginForm'
import HomeForm from './Components/HomeForm/HomeForm'
import SignupForm from "./Components/SignupForm/SignupForm";
import WriteForm from './Components/WriteForm/WriteForm'

import fetchUser from './fetchUser'
import AuthenticatedRoute from './AuthenticatedRoute'
import AnonymouseRoute from './AnonymouseRoute'

function App() {
    const navigate = useNavigate()
    const [authenticated, setAuthenticated] = useState(false)

    const checkAuthentication = async () => {
        try {
            const isAuthenticated = await fetchUser()
            setAuthenticated(isAuthenticated)
        } catch (error) {
            console.error('Error occurred while fetching user:', error)
        }
    }
    useEffect(() => {
        checkAuthentication()
        if (!authenticated) {
            navigate(window.location.pathname, { replace: true })
        }
    }, [navigate, authenticated]) // navigate를 의존성 배열에 추가

    return (
        <>
            <Navbar authenticated={authenticated} />
            <Routes>
                <Route path="/" element={<HomeForm />} />
                <Route
                    path="/write"
                    element={<AuthenticatedRoute authenticated={authenticated} component={WriteForm} />}
                />
                <Route
                    path="/login"
                    element={<AnonymouseRoute authenticated={authenticated} component={LoginForm} />}
                />
            </Routes>
        </>
    )
}

export default App
