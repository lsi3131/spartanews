import React from 'react'
import { Link } from 'react-router-dom' // 라우팅을 사용한다면

import './Navbar.css'

function Navbar() {
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

export default Navbar
