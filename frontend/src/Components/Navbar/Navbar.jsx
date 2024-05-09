import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import fetchUser from '../../fetchUser'
import './Navbar.css'

// 인증된 사용자를 위한 네비게이션
const AuthenticatedNavbar = ({ username }) => {
    return (
        <nav className="navbar">
            <div className="left">
                <Link to="/">Home</Link>
                <Link to="/write">Write</Link>
                <Link to="/ask">Ask</Link>
                <Link to="/show">Show</Link>
            </div>
            <div className="right">
                <Link to={`/profile/${username}/`}>{username}</Link>
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
                <Link to="/ask">Ask</Link>
                <Link to="/show">Show</Link>
            </div>
            <div className="right">
                <Link to="/login">Login</Link>
            </div>
        </nav>
    )
}

const Navbar = ({ username }) => {
    return <div>{username ? <AuthenticatedNavbar username={username} /> : <UnauthenticatedNavbar />}</div>
}
export default Navbar
