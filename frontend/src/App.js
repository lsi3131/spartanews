import './App.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { useState, useEffect } from 'react'

import Cursor from './Components/Cursor/Cursor'
import Navbar from './Components/Navbar/Navbar'
import LoginForm from './Components/LoginForm/LoginForm'
import HomeForm from './Components/HomeForm/HomeForm'
import SignupForm from './Components/SignupForm/SignupForm'
import WriteForm from './Components/WriteForm/WriteForm'
import AskForm from './Components/AskForm/AskForm'
import ShowForm from './Components/ShowForm/ShowForm'
import DetailArticleForm from './Components/DetailArticleForm/DetailArticleForm'

import fetchUser from './fetchUser'
import AuthenticatedRoute from './AuthenticatedRoute'
import AnonymouseRoute from './AnonymouseRoute'
import ProfileForm from './Components/ProfileForm/ProfileForm'

import { jwtDecode } from 'jwt-decode'

function App() {
    const navigate = useNavigate()
    const [userInfos, setUserInfos] = useState([{}])
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
        } else {
            const token = localStorage.getItem('accessToken')
            const decoded = jwtDecode(token)
            setUserInfos(decoded)
        }
    }, [navigate, authenticated]) // navigate를 의존성 배열에 추가

    return (
        <>
            <Cursor />
            <Navbar username={userInfos.username} />
            <Routes>
                <Route path="/" element={<HomeForm />} />
                <Route
                    path="/write"
                    element={<AuthenticatedRoute authenticated={authenticated} component={WriteForm} />}
                />
                <Route
                    path="/ask"
                    element={<AuthenticatedRoute authenticated={true} component={AskForm} />}
                />
                <Route
                    path="/Show"
                    element={<AuthenticatedRoute authenticated={true} component={ShowForm} />}
                />
                <Route
                    path="/login"
                    element={<AnonymouseRoute authenticated={authenticated} component={LoginForm} />}
                />
                <Route
                    path="/signup"
                    element={<AnonymouseRoute authenticated={authenticated} component={SignupForm} />}
                />
                <Route
                    path="/detail/:articleId" element={<DetailArticleForm username={userInfos.username} userId={userInfos.user_id} />}
                />

                <Route path="/profile/:name" element={<ProfileForm username={userInfos.username} />} />
            </Routes>
        </>
    )
}

export default App
