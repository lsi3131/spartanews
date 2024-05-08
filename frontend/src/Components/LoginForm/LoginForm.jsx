import React from 'react'
import { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa6'
import { MdLock } from 'react-icons/md'
import axios from 'axios'
import './LoginForm.css'
import { Link } from 'react-router-dom'

const LoginForm = () => {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', {
                username: username,
                password: password,
            })
            const { access, refresh } = response.data
            localStorage.setItem('accessToken', access)
            localStorage.setItem('refreshToken', refresh)
            window.location.href = '/' // 혹은 메인 화면으로
        } catch (error) {
            console.error('로그인 오류:', error)
            // 오류 처리 로직을 추가할 수 있습니다.
        }
    }

    return (
        <div className="login-content">
            <div className="login-wrapper">
                <h1>로그인</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-box">
                        <input
                            type="text"
                            placeholder="아이디를 입력해주세요"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <FaUser className="icon" />
                    </div>
                    <div className="input-box">
                        <input
                            type="password"
                            placeholder="패스워드를 입력해주세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <MdLock className="icon" />
                    </div>
                    <div className="remember-forget">
                        <label>
                            <input type="checkbox" /> 로그인 정보 저장
                        </label>
                        <a href="#">패스워드를 잊어버리셨습니까?</a>
                    </div>
                    <button type="submit">로그인</button>
                    <div className="register-link">
                        <p>
                            계정이 없으신가요?
                            <Link to="/signup">회원가입</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default LoginForm
