import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import fetchUser from '../../fetchUser'
import './Navbar.css'

// 로그아웃 프로세스
const logoutProcess = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/login'
}
// 인증된 사용자를 위한 네비게이션
const AuthenticatedNavbar = () => {
    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/">Home</Link>
                <Link to="/write">Write</Link>
            </div>
            <div className="right">
                <a onClick={logoutProcess}>Logout</a>
            </div>
        </nav>
    )
}

// 인증되지 않은 사용자를 위한 네비게이션
const UnauthenticatedNavbar = () => {
    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/">Home</Link>
                <Link to="/write">Write</Link>
            </div>
            <div className="right">
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}

const Navbar = ({ authenticated }) => {
    return <div>{authenticated ? <AuthenticatedNavbar /> : <UnauthenticatedNavbar />}</div>
}
export default Navbar
